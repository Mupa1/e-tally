const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

async function testBulkUpload() {
  try {
    console.log('🚀 Testing bulk upload functionality...');

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

    // Take first 10 records for testing
    const testData = pollingStations.slice(0, 10);
    console.log(`🧪 Testing with first ${testData.length} records`);

    // Prepare the request payload
    const payload = {
      pollingStations: testData,
    };

    // Save test payload to file
    const testPayloadPath = path.join(__dirname, 'test-payload.json');
    fs.writeFileSync(testPayloadPath, JSON.stringify(payload, null, 2));
    console.log(`💾 Test payload saved to: ${testPayloadPath}`);

    // Show sample data
    console.log('\n📋 Sample data:');
    testData.slice(0, 3).forEach((station, index) => {
      console.log(
        `${index + 1}. ${station.countyCode} - ${station.countyName} | ${
          station.constCode
        } - ${station.constName} | ${station.cawCode} - ${station.cawName} | ${
          station.pollingStationCode
        } - ${station.pollingStationName} | ${station.registeredVoters} voters`
      );
    });

    console.log('\n✅ Test data prepared successfully!');
    console.log('📝 To test the API, you can use:');
    console.log(
      `curl -X POST http://localhost:3000/api/polling-stations/bulk-upload \\`
    );
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -H "Authorization: Bearer YOUR_TOKEN" \\`);
    console.log(`  -d @${testPayloadPath}`);
  } catch (error) {
    console.error('❌ Error preparing test data:', error);
  }
}

testBulkUpload();
