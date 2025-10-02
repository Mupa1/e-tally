import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/AppError';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { convert: true });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      return next(new AppError(`Validation error: ${errorMessage}`));
    }

    // Replace req.body with the converted values
    req.body = value;
    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, { convert: true });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      return next(new AppError(`Parameter validation error: ${errorMessage}`));
    }

    // Replace req.params with the converted values
    req.params = value;
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, { convert: true });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      return next(new AppError(`Query validation error: ${errorMessage}`));
    }

    // Replace req.query with the converted values
    req.query = value;
    next();
  };
};

// Common validation schemas
export const schemas = {
  id: Joi.object({
    id: Joi.string().required(),
  }),

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(1000).default(10),
    sortBy: Joi.string().default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    search: Joi.string().optional(),
    role: Joi.string().optional(),
    isActive: Joi.string().valid('true', 'false').optional(),
    countyId: Joi.string().optional(),
  }),

  electoralPositionPagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(1000).default(10),
    sortBy: Joi.string().default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
    search: Joi.string().optional(),
    level: Joi.string()
      .valid('NATIONAL', 'COUNTY', 'CONSTITUENCY', 'WARD')
      .optional(),
    isActive: Joi.string().valid('true', 'false').optional(),
  }),

  user: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phoneNumber: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .optional(),
    imei: Joi.string()
      .pattern(/^[0-9]{15}$/)
      .optional(),
    role: Joi.string()
      .valid(
        'SUPER_ADMIN',
        'CENTRAL_COMMAND_ADMIN',
        'CENTRAL_COMMAND_USER',
        'PRESIDENTIAL_ELECTION_OBSERVER',
        'PARLIAMENTARY_ELECTION_OBSERVER',
        'LOCAL_GOVERNMENT_ELECTION_OBSERVER',
        'SENATORIAL_ELECTION_OBSERVER',
        'GUBERNATORIAL_ELECTION_OBSERVER',
        'COUNTY_LEVEL_SUPERVISOR',
        'CONSTITUENCY_LEVEL_SUPERVISOR',
        'COUNTY_ASSEMBLY_WARD_SUPERVISOR'
      )
      .required(),
  }),

  login: Joi.object({
    email: Joi.string().email().optional(),
    username: Joi.string().alphanum().optional(),
    password: Joi.string().required(),
    imei: Joi.string()
      .pattern(/^[0-9]{15}$/)
      .optional(),
  }).or('email', 'username'),

  userUpdate: Joi.object({
    email: Joi.string().email().optional(),
    username: Joi.string().alphanum().min(3).max(30).optional(),
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    phoneNumber: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .optional(),
    imei: Joi.string()
      .pattern(/^[0-9]{15}$/)
      .optional(),
    role: Joi.string()
      .valid(
        'SUPER_ADMIN',
        'CENTRAL_COMMAND_ADMIN',
        'CENTRAL_COMMAND_USER',
        'PRESIDENTIAL_ELECTION_OBSERVER',
        'PARLIAMENTARY_ELECTION_OBSERVER',
        'LOCAL_GOVERNMENT_ELECTION_OBSERVER',
        'SENATORIAL_ELECTION_OBSERVER',
        'GUBERNATORIAL_ELECTION_OBSERVER',
        'COUNTY_LEVEL_SUPERVISOR',
        'CONSTITUENCY_LEVEL_SUPERVISOR',
        'COUNTY_ASSEMBLY_WARD_SUPERVISOR'
      )
      .optional(),
    isActive: Joi.boolean().optional(),
  }),

  changePassword: Joi.object({
    newPassword: Joi.string().min(8).required(),
  }),

  bulkOperation: Joi.object({
    userIds: Joi.array().items(Joi.string()).min(1).required(),
  }),

  electionResult: Joi.object({
    pollingStationId: Joi.string().required(),
    candidateId: Joi.string().required(),
    electionType: Joi.string()
      .valid(
        'GENERAL_ELECTION',
        'RUNOFF_ELECTION',
        'BY_ELECTIONS',
        'PRIMARY_ELECTIONS'
      )
      .required(),
    votes: Joi.number().integer().min(0).required(),
    spoiltVotes: Joi.number().integer().min(0).default(0),
  }),

  incident: Joi.object({
    pollingStationId: Joi.string().required(),
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().max(1000).optional(),
    incidentType: Joi.string()
      .valid(
        'VIOLENCE',
        'VOTER_INTIMIDATION',
        'EQUIPMENT_FAILURE',
        'IRREGULARITY',
        'OTHER'
      )
      .required(),
    severity: Joi.string()
      .valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
      .required(),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
  }),

  county: Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
  }),

  countyUpdate: Joi.object({
    code: Joi.string().optional(),
    name: Joi.string().optional(),
  }),

  countiesBulk: Joi.object({
    counties: Joi.array()
      .items(
        Joi.object({
          code: Joi.string().required(),
          name: Joi.string().required(),
        })
      )
      .min(1)
      .required(),
  }),

  constituency: Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    countyId: Joi.string().required(),
  }),

  constituencyUpdate: Joi.object({
    code: Joi.string().optional(),
    name: Joi.string().optional(),
    countyId: Joi.string().optional(),
  }),

  caw: Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    constituencyId: Joi.string().required(),
  }),

  cawUpdate: Joi.object({
    code: Joi.string().optional(),
    name: Joi.string().optional(),
    constituencyId: Joi.string().optional(),
  }),

  pollingStation: Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    constituencyId: Joi.string().required(),
    cawId: Joi.string().required(),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    address: Joi.string().max(500).optional(),
  }),

  pollingStationUpdate: Joi.object({
    code: Joi.string().optional(),
    name: Joi.string().optional(),
    constituencyId: Joi.string().optional(),
    cawId: Joi.string().optional(),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    address: Joi.string().max(500).optional(),
    isActive: Joi.boolean().optional(),
  }),

  candidate: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    party: Joi.string().max(100).optional(),
    electionType: Joi.string()
      .valid(
        'PRESIDENTIAL',
        'PARLIAMENTARY',
        'LOCAL_GOVERNMENT',
        'SENATORIAL',
        'GUBERNATORIAL',
        'COUNTY_ASSEMBLY_REPRESENTATIVE',
        'WOMENS_REPRESENTATIVE'
      )
      .required(),
    constituencyId: Joi.string().optional(),
    cawId: Joi.string().optional(),
  }),

  candidateUpdate: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    party: Joi.string().max(100).optional(),
    electionType: Joi.string()
      .valid(
        'PRESIDENTIAL',
        'PARLIAMENTARY',
        'LOCAL_GOVERNMENT',
        'SENATORIAL',
        'GUBERNATORIAL',
        'COUNTY_ASSEMBLY_REPRESENTATIVE',
        'WOMENS_REPRESENTATIVE'
      )
      .optional(),
    constituencyId: Joi.string().optional(),
    cawId: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
  }),

  electionResultUpdate: Joi.object({
    pollingStationId: Joi.string().optional(),
    candidateId: Joi.string().optional(),
    votes: Joi.number().integer().min(0).optional(),
    spoiltVotes: Joi.number().integer().min(0).optional(),
  }),

  incidentUpdate: Joi.object({
    pollingStationId: Joi.string().optional(),
    title: Joi.string().min(5).max(200).optional(),
    description: Joi.string().max(1000).optional(),
    incidentType: Joi.string()
      .valid(
        'VIOLENCE',
        'VOTER_INTIMIDATION',
        'EQUIPMENT_FAILURE',
        'IRREGULARITY',
        'OTHER'
      )
      .optional(),
    severity: Joi.string()
      .valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
      .optional(),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    isResolved: Joi.boolean().optional(),
  }),
};
