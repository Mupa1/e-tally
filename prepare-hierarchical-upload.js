const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

async function prepareHierarchicalUpload() {
  try {
    console.log('🚀 Preparing hierarchical bulk upload...');

    // Read the CSV file
    const csvPath = path.join(
      __dirname,
      'extracted-data',
      'polling_stations_python.csv'
    );

    if (!fs.existsSync(csvPath)) {
      console.error('❌ CSV file not found:', csvPath);
      return;
    }

    console.log(`📄 Reading CSV from: ${csvPath}`);

    const pollingStations = [];

    // Parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          // Skip header row
          if (row['County Code'] === 'County Code') {
            return;
          }

          pollingStations.push({
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
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(
      `📊 Parsed ${pollingStations.length} polling stations from CSV`
    );

    // Analyze the data structure
    const countyStats = new Map();
    const constituencyStats = new Map();
    const cawStats = new Map();

    pollingStations.forEach((station) => {
      // Count counties
      const countyKey = `${station.countyCode}-${station.countyName}`;
      countyStats.set(countyKey, (countyStats.get(countyKey) || 0) + 1);

      // Count constituencies
      const constituencyKey = `${station.constCode}-${station.constName}`;
      constituencyStats.set(
        constituencyKey,
        (constituencyStats.get(constituencyKey) || 0) + 1
      );

      // Count CAWs
      const cawKey = `${station.cawCode}-${station.cawName}`;
      cawStats.set(cawKey, (cawStats.get(cawKey) || 0) + 1);
    });

    console.log('\n📈 Data Analysis:');
    console.log(`🏛️  Counties: ${countyStats.size} unique`);
    console.log(`🏛️  Constituencies: ${constituencyStats.size} unique`);
    console.log(`🏛️  CAWs (Wards): ${cawStats.size} unique`);
    console.log(`🏛️  Polling Stations: ${pollingStations.length} total`);

    // Show sample data
    console.log('\n📋 Sample Counties:');
    Array.from(countyStats.entries())
      .slice(0, 5)
      .forEach(([key, count]) => {
        const [code, name] = key.split('-');
        console.log(`  ${code} - ${name} (${count} polling stations)`);
      });

    console.log('\n📋 Sample Constituencies:');
    Array.from(constituencyStats.entries())
      .slice(0, 5)
      .forEach(([key, count]) => {
        const [code, name] = key.split('-');
        console.log(`  ${code} - ${name} (${count} polling stations)`);
      });

    console.log('\n📋 Sample CAWs:');
    Array.from(cawStats.entries())
      .slice(0, 5)
      .forEach(([key, count]) => {
        const [code, name] = key.split('-');
        console.log(`  ${code} - ${name} (${count} polling stations)`);
      });

    // Prepare the request payload
    const payload = {
      pollingStations: pollingStations,
    };

    // Save full payload to file
    const fullPayloadPath = path.join(
      __dirname,
      'hierarchical-upload-payload.json'
    );
    fs.writeFileSync(fullPayloadPath, JSON.stringify(payload, null, 2));
    console.log(`\n💾 Full payload saved to: ${fullPayloadPath}`);
    console.log(
      `📊 Payload size: ${(
        fs.statSync(fullPayloadPath).size /
        1024 /
        1024
      ).toFixed(2)} MB`
    );

    // Create a smaller test payload (first 100 records)
    const testPayload = {
      pollingStations: pollingStations.slice(0, 100),
    };

    const testPayloadPath = path.join(
      __dirname,
      'hierarchical-test-payload.json'
    );
    fs.writeFileSync(testPayloadPath, JSON.stringify(testPayload, null, 2));
    console.log(`💾 Test payload (100 records) saved to: ${testPayloadPath}`);

    console.log('\n✅ Hierarchical upload data prepared successfully!');
    console.log('\n📝 To test the hierarchical upload API:');
    console.log(
      `curl -X POST http://localhost:3000/api/bulk-upload/hierarchical \\`
    );
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -H "Authorization: Bearer YOUR_TOKEN" \\`);
    console.log(`  -d @${testPayloadPath}`);

    console.log('\n📝 To upload the full dataset:');
    console.log(
      `curl -X POST http://localhost:3000/api/bulk-upload/hierarchical \\`
    );
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -H "Authorization: Bearer YOUR_TOKEN" \\`);
    console.log(`  -d @${fullPayloadPath}`);

    console.log('\n📝 To check upload status:');
    console.log(`curl -X GET http://localhost:3000/api/bulk-upload/status \\`);
    console.log(`  -H "Authorization: Bearer YOUR_TOKEN"`);
  } catch (error) {
    console.error('❌ Error preparing hierarchical upload:', error);
  }
}

prepareHierarchicalUpload();
