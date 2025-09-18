import express from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import { authenticateToken, logUserAction } from '../middleware/auth';
import { requireAdmin } from '../middleware/authorization';
import { validateRequest } from '../middleware/validation';
import Joi from 'joi';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed') as any, false);
    }
  },
});

// Validation schema for hierarchical bulk upload
const hierarchicalBulkUploadSchema = Joi.object({
  pollingStations: Joi.array()
    .items(
      Joi.object({
        countyCode: Joi.string().required(),
        countyName: Joi.string().required(),
        constCode: Joi.string().required(),
        constName: Joi.string().required(),
        cawCode: Joi.string().required(),
        cawName: Joi.string().required(),
        regCentreCode: Joi.string().required(),
        regCentreName: Joi.string().required(),
        pollingStationCode: Joi.string().required(),
        pollingStationName: Joi.string().required(),
        registeredVoters: Joi.number().integer().min(0).required(),
      })
    )
    .min(1)
    .max(50000) // Increased limit for full dataset
    .required(),
});

// POST /api/bulk-upload/upload-csv - Upload and process CSV file
router.post(
  '/upload-csv',
  authenticateToken,
  requireAdmin,
  logUserAction('UPLOAD_CSV', 'GEOGRAPHIC_DATA'),
  upload.single('csv'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: { message: 'No CSV file provided' },
        });
      }

      logger.info(`Processing CSV file: ${req.file.originalname}`);

      // Read the CSV file
      const csvContent = fs.readFileSync(req.file.path, 'utf-8');
      const lines = csvContent.split('\n').filter((line) => line.trim());
      const headers = lines[0].split(',').map((h) => h.trim());
      const previewData = lines
        .slice(1, 6)
        .map((line) => line.split(',').map((cell) => cell.trim()));

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      logger.info(
        `CSV processing completed successfully. Found ${
          lines.length - 1
        } records.`
      );

      return res.json({
        success: true,
        data: {
          csvContent,
          headers,
          previewData,
          totalRecords: lines.length - 1,
        },
        message: 'CSV processed successfully',
      });
    } catch (error: any) {
      logger.error('Error processing CSV:', error);

      // Clean up files on error
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          logger.error('Error cleaning up uploaded file:', cleanupError);
        }
      }

      return next(new AppError(`CSV processing failed: ${error.message}`, 500));
    }
  }
);

// POST /api/bulk-upload/hierarchical - Hierarchical bulk upload
router.post(
  '/hierarchical',
  authenticateToken,
  requireAdmin,
  logUserAction('HIERARCHICAL_BULK_UPLOAD', 'GEOGRAPHIC_DATA'),
  validateRequest(hierarchicalBulkUploadSchema),
  async (req, res, next) => {
    try {
      const { pollingStations } = req.body;

      logger.info(
        `Starting hierarchical bulk upload of ${pollingStations.length} polling stations`
      );

      const results = {
        total: pollingStations.length,
        counties: { created: 0, existing: 0, errors: [] as any[] },
        constituencies: { created: 0, existing: 0, errors: [] as any[] },
        caws: { created: 0, existing: 0, errors: [] as any[] },
        pollingStations: { created: 0, existing: 0, errors: [] as any[] },
        voterRegistrations: { created: 0, errors: [] as any[] },
      };

      // Step 1: Extract and create unique counties
      logger.info('🏛️ Step 1: Processing Counties...');
      const countyMap = new Map();
      const uniqueCounties = new Map();

      for (const station of pollingStations) {
        const key = `${station.countyCode}-${station.countyName}`;
        if (!uniqueCounties.has(key)) {
          uniqueCounties.set(key, {
            code: station.countyCode,
            name: station.countyName,
          });
        }
      }

      for (const [key, countyData] of uniqueCounties) {
        try {
          let county = await prisma.county.findFirst({
            where: {
              OR: [
                { code: countyData.code },
                { name: { equals: countyData.name, mode: 'insensitive' } },
              ],
            },
          });

          if (!county) {
            county = await prisma.county.create({
              data: {
                code: countyData.code,
                name: countyData.name,
              },
            });
            results.counties.created++;
            logger.info(`Created county: ${county.code} - ${county.name}`);
          } else {
            results.counties.existing++;
          }

          countyMap.set(key, county);
        } catch (error: any) {
          results.counties.errors.push({
            county: countyData.name,
            error: error.message,
          });
          logger.error(`Error creating county ${countyData.name}:`, error);
        }
      }

      // Step 2: Extract and create unique constituencies
      logger.info('🏛️ Step 2: Processing Constituencies...');
      const constituencyMap = new Map();
      const uniqueConstituencies = new Map();

      for (const station of pollingStations) {
        const countyKey = `${station.countyCode}-${station.countyName}`;
        const county = countyMap.get(countyKey);
        if (!county) continue;

        const key = `${station.constCode}-${station.constName}-${county.id}`;
        if (!uniqueConstituencies.has(key)) {
          uniqueConstituencies.set(key, {
            code: station.constCode,
            name: station.constName,
            countyId: county.id,
          });
        }
      }

      for (const [key, constituencyData] of uniqueConstituencies) {
        try {
          let constituency = await prisma.constituency.findFirst({
            where: {
              OR: [
                { code: constituencyData.code },
                {
                  name: { equals: constituencyData.name, mode: 'insensitive' },
                },
              ],
              countyId: constituencyData.countyId,
            },
          });

          if (!constituency) {
            constituency = await prisma.constituency.create({
              data: {
                code: constituencyData.code,
                name: constituencyData.name,
                countyId: constituencyData.countyId,
              },
            });
            results.constituencies.created++;
            logger.info(
              `Created constituency: ${constituency.code} - ${constituency.name}`
            );
          } else {
            results.constituencies.existing++;
          }

          constituencyMap.set(key, constituency);
        } catch (error: any) {
          results.constituencies.errors.push({
            constituency: constituencyData.name,
            error: error.message,
          });
          logger.error(
            `Error creating constituency ${constituencyData.name}:`,
            error
          );
        }
      }

      // Step 3: Extract and create unique CAWs (Wards)
      logger.info('🏛️ Step 3: Processing CAWs (Wards)...');
      const cawMap = new Map();
      const uniqueCAWs = new Map();

      for (const station of pollingStations) {
        const countyKey = `${station.countyCode}-${station.countyName}`;
        const county = countyMap.get(countyKey);
        if (!county) continue;

        const constituencyKey = `${station.constCode}-${station.constName}-${county.id}`;
        const constituency = constituencyMap.get(constituencyKey);
        if (!constituency) continue;

        const key = `${station.cawCode}-${station.cawName}-${constituency.id}`;
        if (!uniqueCAWs.has(key)) {
          uniqueCAWs.set(key, {
            code: station.cawCode,
            name: station.cawName,
            constituencyId: constituency.id,
          });
        }
      }

      for (const [key, cawData] of uniqueCAWs) {
        try {
          let caw = await prisma.cAW.findFirst({
            where: {
              OR: [
                { code: cawData.code },
                { name: { equals: cawData.name, mode: 'insensitive' } },
              ],
              constituencyId: cawData.constituencyId,
            },
          });

          if (!caw) {
            caw = await prisma.cAW.create({
              data: {
                code: cawData.code,
                name: cawData.name,
                constituencyId: cawData.constituencyId,
              },
            });
            results.caws.created++;
            logger.info(`Created CAW: ${caw.code} - ${caw.name}`);
          } else {
            results.caws.existing++;
          }

          cawMap.set(key, caw);
        } catch (error: any) {
          results.caws.errors.push({
            caw: cawData.name,
            error: error.message,
          });
          logger.error(`Error creating CAW ${cawData.name}:`, error);
        }
      }

      // Step 4: Create polling stations
      logger.info('🏛️ Step 4: Processing Polling Stations...');
      const batchSize = 100;

      for (let i = 0; i < pollingStations.length; i += batchSize) {
        const batch = pollingStations.slice(i, i + batchSize);

        for (const stationData of batch) {
          try {
            // Get the related entities
            const countyKey = `${stationData.countyCode}-${stationData.countyName}`;
            const county = countyMap.get(countyKey);
            if (!county) {
              results.pollingStations.errors.push({
                code: stationData.pollingStationCode,
                name: stationData.pollingStationName,
                countyCode: stationData.countyCode,
                countyName: stationData.countyName,
                error: `County not found: ${stationData.countyCode} - ${stationData.countyName}`,
                errorType: 'COUNTY_NOT_FOUND',
                rowData: stationData,
              });
              continue;
            }

            const constituencyKey = `${stationData.constCode}-${stationData.constName}-${county.id}`;
            const constituency = constituencyMap.get(constituencyKey);
            if (!constituency) {
              results.pollingStations.errors.push({
                code: stationData.pollingStationCode,
                name: stationData.pollingStationName,
                countyCode: stationData.countyCode,
                countyName: stationData.countyName,
                constCode: stationData.constCode,
                constName: stationData.constName,
                error: `Constituency not found: ${stationData.constCode} - ${stationData.constName} in County ${stationData.countyCode} - ${stationData.countyName}`,
                errorType: 'CONSTITUENCY_NOT_FOUND',
                rowData: stationData,
              });
              continue;
            }

            const cawKey = `${stationData.cawCode}-${stationData.cawName}-${constituency.id}`;
            const caw = cawMap.get(cawKey);
            if (!caw) {
              results.pollingStations.errors.push({
                code: stationData.pollingStationCode,
                name: stationData.pollingStationName,
                countyCode: stationData.countyCode,
                countyName: stationData.countyName,
                constCode: stationData.constCode,
                constName: stationData.constName,
                cawCode: stationData.cawCode,
                cawName: stationData.cawName,
                error: `CAW not found: ${stationData.cawCode} - ${stationData.cawName} in Constituency ${stationData.constCode} - ${stationData.constName}`,
                errorType: 'CAW_NOT_FOUND',
                rowData: stationData,
              });
              continue;
            }

            // Check if polling station already exists
            const existingStation = await prisma.pollingStation.findUnique({
              where: { code: stationData.pollingStationCode },
            });

            if (existingStation) {
              results.pollingStations.existing++;
              continue;
            }

            // Create polling station
            const pollingStation = await prisma.pollingStation.create({
              data: {
                code: stationData.pollingStationCode,
                name: stationData.pollingStationName,
                constituencyId: constituency.id,
                cawId: caw.id,
                address: stationData.regCentreName,
              },
            });

            results.pollingStations.created++;

            // Create voter registration record
            if (stationData.registeredVoters > 0) {
              try {
                await prisma.voterRegistration.create({
                  data: {
                    pollingStationId: pollingStation.id,
                    registeredVoters: stationData.registeredVoters,
                    source: 'IEBC Import',
                  },
                });
                results.voterRegistrations.created++;
              } catch (error: any) {
                results.voterRegistrations.errors.push({
                  pollingStation: stationData.pollingStationCode,
                  error: error.message,
                });
              }
            }

            if (results.pollingStations.created % 1000 === 0) {
              logger.info(
                `Processed ${results.pollingStations.created} polling stations...`
              );
            }
          } catch (error: any) {
            results.pollingStations.errors.push({
              code: stationData.pollingStationCode,
              name: stationData.pollingStationName,
              countyCode: stationData.countyCode,
              countyName: stationData.countyName,
              constCode: stationData.constCode,
              constName: stationData.constName,
              cawCode: stationData.cawCode,
              cawName: stationData.cawName,
              error: error.message,
              errorType: 'PROCESSING_ERROR',
              rowData: stationData,
            });
            logger.error(
              `Error processing polling station ${stationData.pollingStationCode}:`,
              error
            );
          }
        }
      }

      logger.info('🎉 Hierarchical bulk upload completed successfully!');
      logger.info(
        `Counties: ${results.counties.created} created, ${results.counties.existing} existing`
      );
      logger.info(
        `Constituencies: ${results.constituencies.created} created, ${results.constituencies.existing} existing`
      );
      logger.info(
        `CAWs: ${results.caws.created} created, ${results.caws.existing} existing`
      );
      logger.info(
        `Polling Stations: ${results.pollingStations.created} created, ${results.pollingStations.existing} existing`
      );
      logger.info(
        `Voter Registrations: ${results.voterRegistrations.created} created`
      );

      res.json({
        success: true,
        data: results,
        message: 'Hierarchical bulk upload completed successfully',
      });
    } catch (error: any) {
      logger.error('Error in hierarchical bulk upload:', error);
      next(new AppError('Failed to process hierarchical bulk upload', 500));
    }
  }
);

// GET /api/bulk-upload/status - Get upload status and statistics
router.get(
  '/status',
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const [
        countyCount,
        constituencyCount,
        cawCount,
        pollingStationCount,
        voterRegistrationCount,
      ] = await Promise.all([
        prisma.county.count(),
        prisma.constituency.count(),
        prisma.cAW.count(),
        prisma.pollingStation.count(),
        prisma.voterRegistration.count(),
      ]);

      res.json({
        success: true,
        data: {
          counties: countyCount,
          constituencies: constituencyCount,
          caws: cawCount,
          pollingStations: pollingStationCount,
          voterRegistrations: voterRegistrationCount,
        },
      });
    } catch (error: any) {
      logger.error('Error fetching upload status:', error);
      next(new AppError('Failed to fetch upload status', 500));
    }
  }
);

// Helper function to parse CSV content
function parseCSVFromContent(csvContent: string) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map((h) => h.trim());

  return lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => {
      const values = line.split(',').map((v) => v.trim());
      const row: any = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      return {
        countyCode: row['County Code'],
        countyName: row['County Name'],
        constCode: row['Const Code'],
        constName: row['Const. Name'],
        cawCode: row['CAW Code'],
        cawName: row['CAW Name'],
        regCentreCode: row['Reg. Centre Code'],
        regCentreName: row['Reg. Centre Name'],
        pollingStationCode: row['Polling Station Code'],
        pollingStationName: row['Polling Station Name'],
        registeredVoters: parseInt(row['Registered Voters']) || 0,
      };
    });
}

// Helper function to process hierarchical upload
async function processHierarchicalUpload(pollingStations: any[]) {
  const results = {
    total: pollingStations.length,
    counties: { created: 0, existing: 0, errors: [] as any[] },
    constituencies: { created: 0, existing: 0, errors: [] as any[] },
    caws: { created: 0, existing: 0, errors: [] as any[] },
    pollingStations: { created: 0, existing: 0, errors: [] as any[] },
    voterRegistrations: { created: 0, errors: [] as any[] },
  };

  // Step 1: Extract and create unique counties
  logger.info('🏛️ Step 1: Processing Counties...');
  const countyMap = new Map();
  const uniqueCounties = new Map();

  for (const station of pollingStations) {
    const key = `${station.countyCode}-${station.countyName}`;
    if (!uniqueCounties.has(key)) {
      uniqueCounties.set(key, {
        code: station.countyCode,
        name: station.countyName,
      });
    }
  }

  for (const [key, countyData] of uniqueCounties) {
    try {
      let county = await prisma.county.findFirst({
        where: {
          OR: [
            { code: countyData.code },
            { name: { equals: countyData.name, mode: 'insensitive' } },
          ],
        },
      });

      if (!county) {
        county = await prisma.county.create({
          data: {
            code: countyData.code,
            name: countyData.name,
          },
        });
        results.counties.created++;
        logger.info(`Created county: ${county.code} - ${county.name}`);
      } else {
        results.counties.existing++;
      }

      countyMap.set(key, county);
    } catch (error: any) {
      results.counties.errors.push({
        county: countyData.name,
        error: error.message,
      });
      logger.error(`Error creating county ${countyData.name}:`, error);
    }
  }

  // Step 2: Extract and create unique constituencies
  logger.info('🏛️ Step 2: Processing Constituencies...');
  const constituencyMap = new Map();
  const uniqueConstituencies = new Map();

  for (const station of pollingStations) {
    const countyKey = `${station.countyCode}-${station.countyName}`;
    const county = countyMap.get(countyKey);
    if (!county) continue;

    const key = `${station.constCode}-${station.constName}-${county.id}`;
    if (!uniqueConstituencies.has(key)) {
      uniqueConstituencies.set(key, {
        code: station.constCode,
        name: station.constName,
        countyId: county.id,
      });
    }
  }

  for (const [key, constituencyData] of uniqueConstituencies) {
    try {
      let constituency = await prisma.constituency.findFirst({
        where: {
          OR: [
            { code: constituencyData.code },
            {
              name: { equals: constituencyData.name, mode: 'insensitive' },
            },
          ],
          countyId: constituencyData.countyId,
        },
      });

      if (!constituency) {
        constituency = await prisma.constituency.create({
          data: {
            code: constituencyData.code,
            name: constituencyData.name,
            countyId: constituencyData.countyId,
          },
        });
        results.constituencies.created++;
        logger.info(
          `Created constituency: ${constituency.code} - ${constituency.name}`
        );
      } else {
        results.constituencies.existing++;
      }

      constituencyMap.set(key, constituency);
    } catch (error: any) {
      results.constituencies.errors.push({
        constituency: constituencyData.name,
        error: error.message,
      });
      logger.error(
        `Error creating constituency ${constituencyData.name}:`,
        error
      );
    }
  }

  // Step 3: Extract and create unique CAWs (Wards)
  logger.info('🏛️ Step 3: Processing CAWs (Wards)...');
  const cawMap = new Map();
  const uniqueCAWs = new Map();

  for (const station of pollingStations) {
    const countyKey = `${station.countyCode}-${station.countyName}`;
    const county = countyMap.get(countyKey);
    if (!county) continue;

    const constituencyKey = `${station.constCode}-${station.constName}-${county.id}`;
    const constituency = constituencyMap.get(constituencyKey);
    if (!constituency) continue;

    const key = `${station.cawCode}-${station.cawName}-${constituency.id}`;
    if (!uniqueCAWs.has(key)) {
      uniqueCAWs.set(key, {
        code: station.cawCode,
        name: station.cawName,
        constituencyId: constituency.id,
      });
    }
  }

  for (const [key, cawData] of uniqueCAWs) {
    try {
      let caw = await prisma.cAW.findFirst({
        where: {
          OR: [
            { code: cawData.code },
            { name: { equals: cawData.name, mode: 'insensitive' } },
          ],
          constituencyId: cawData.constituencyId,
        },
      });

      if (!caw) {
        caw = await prisma.cAW.create({
          data: {
            code: cawData.code,
            name: cawData.name,
            constituencyId: cawData.constituencyId,
          },
        });
        results.caws.created++;
        logger.info(`Created CAW: ${caw.code} - ${caw.name}`);
      } else {
        results.caws.existing++;
      }

      cawMap.set(key, caw);
    } catch (error: any) {
      results.caws.errors.push({
        caw: cawData.name,
        error: error.message,
      });
      logger.error(`Error creating CAW ${cawData.name}:`, error);
    }
  }

  // Step 4: Create polling stations
  logger.info('🏛️ Step 4: Processing Polling Stations...');
  const batchSize = 100;

  for (let i = 0; i < pollingStations.length; i += batchSize) {
    const batch = pollingStations.slice(i, i + batchSize);

    for (const stationData of batch) {
      try {
        // Get the related entities
        const countyKey = `${stationData.countyCode}-${stationData.countyName}`;
        const county = countyMap.get(countyKey);
        if (!county) {
          results.pollingStations.errors.push({
            code: stationData.pollingStationCode,
            name: stationData.pollingStationName,
            countyCode: stationData.countyCode,
            countyName: stationData.countyName,
            error: `County not found: ${stationData.countyCode} - ${stationData.countyName}`,
            errorType: 'COUNTY_NOT_FOUND',
            rowData: stationData,
          });
          continue;
        }

        const constituencyKey = `${stationData.constCode}-${stationData.constName}-${county.id}`;
        const constituency = constituencyMap.get(constituencyKey);
        if (!constituency) {
          results.pollingStations.errors.push({
            code: stationData.pollingStationCode,
            name: stationData.pollingStationName,
            countyCode: stationData.countyCode,
            countyName: stationData.countyName,
            constCode: stationData.constCode,
            constName: stationData.constName,
            error: `Constituency not found: ${stationData.constCode} - ${stationData.constName} in County ${stationData.countyCode} - ${stationData.countyName}`,
            errorType: 'CONSTITUENCY_NOT_FOUND',
            rowData: stationData,
          });
          continue;
        }

        const cawKey = `${stationData.cawCode}-${stationData.cawName}-${constituency.id}`;
        const caw = cawMap.get(cawKey);
        if (!caw) {
          results.pollingStations.errors.push({
            code: stationData.pollingStationCode,
            name: stationData.pollingStationName,
            countyCode: stationData.countyCode,
            countyName: stationData.countyName,
            constCode: stationData.constCode,
            constName: stationData.constName,
            cawCode: stationData.cawCode,
            cawName: stationData.cawName,
            error: `CAW not found: ${stationData.cawCode} - ${stationData.cawName} in Constituency ${stationData.constCode} - ${stationData.constName}`,
            errorType: 'CAW_NOT_FOUND',
            rowData: stationData,
          });
          continue;
        }

        // Check if polling station already exists
        const existingStation = await prisma.pollingStation.findUnique({
          where: { code: stationData.pollingStationCode },
        });

        if (existingStation) {
          results.pollingStations.existing++;
          continue;
        }

        // Create polling station
        const pollingStation = await prisma.pollingStation.create({
          data: {
            code: stationData.pollingStationCode,
            name: stationData.pollingStationName,
            constituencyId: constituency.id,
            cawId: caw.id,
            address: stationData.regCentreName,
          },
        });

        results.pollingStations.created++;

        // Create voter registration record
        if (stationData.registeredVoters > 0) {
          try {
            await prisma.voterRegistration.create({
              data: {
                pollingStationId: pollingStation.id,
                registeredVoters: stationData.registeredVoters,
                source: 'IEBC Import',
              },
            });
            results.voterRegistrations.created++;
          } catch (error: any) {
            results.voterRegistrations.errors.push({
              pollingStation: stationData.pollingStationCode,
              error: error.message,
            });
          }
        }

        if (results.pollingStations.created % 1000 === 0) {
          logger.info(
            `Processed ${results.pollingStations.created} polling stations...`
          );
        }
      } catch (error: any) {
        results.pollingStations.errors.push({
          code: stationData.pollingStationCode,
          name: stationData.pollingStationName,
          countyCode: stationData.countyCode,
          countyName: stationData.countyName,
          constCode: stationData.constCode,
          constName: stationData.constName,
          cawCode: stationData.cawCode,
          cawName: stationData.cawName,
          error: error.message,
          errorType: 'PROCESSING_ERROR',
          rowData: stationData,
        });
        logger.error(
          `Error processing polling station ${stationData.pollingStationCode}:`,
          error
        );
      }
    }
  }

  logger.info('🎉 Hierarchical bulk upload completed successfully!');
  logger.info(
    `Counties: ${results.counties.created} created, ${results.counties.existing} existing`
  );
  logger.info(
    `Constituencies: ${results.constituencies.created} created, ${results.constituencies.existing} existing`
  );
  logger.info(
    `CAWs: ${results.caws.created} created, ${results.caws.existing} existing`
  );
  logger.info(
    `Polling Stations: ${results.pollingStations.created} created, ${results.pollingStations.existing} existing`
  );
  logger.info(
    `Voter Registrations: ${results.voterRegistrations.created} created`
  );

  return results;
}

export default router;
