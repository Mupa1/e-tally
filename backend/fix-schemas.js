const fs = require('fs');
const path = require('path');

const routeFiles = [
  'src/routes/constituencies.ts',
  'src/routes/caws.ts',
  'src/routes/pollingStations.ts',
  'src/routes/candidates.ts',
  'src/routes/electionResults.ts',
  'src/routes/incidents.ts',
  'src/routes/users.ts',
  'src/routes/audit.ts',
];

const schemaReplacements = [
  // Constituencies
  {
    from: /Joi\.object\(\{\s*code: Joi\.string\(\)\.required\(\),\s*name: Joi\.string\(\)\.required\(\),\s*countyId: Joi\.string\(\)\.required\(\),\s*\}\)/g,
    to: 'schemas.constituency',
  },
  {
    from: /Joi\.object\(\{\s*code: Joi\.string\(\)\.optional\(\),\s*name: Joi\.string\(\)\.optional\(\),\s*countyId: Joi\.string\(\)\.optional\(\),\s*\}\)/g,
    to: 'schemas.constituencyUpdate',
  },

  // CAWs
  {
    from: /Joi\.object\(\{\s*code: Joi\.string\(\)\.required\(\),\s*name: Joi\.string\(\)\.required\(\),\s*constituencyId: Joi\.string\(\)\.required\(\),\s*\}\)/g,
    to: 'schemas.caw',
  },
  {
    from: /Joi\.object\(\{\s*code: Joi\.string\(\)\.optional\(\),\s*name: Joi\.string\(\)\.optional\(\),\s*constituencyId: Joi\.string\(\)\.optional\(\),\s*\}\)/g,
    to: 'schemas.cawUpdate',
  },

  // Polling Stations
  {
    from: /Joi\.object\(\{\s*code: Joi\.string\(\)\.required\(\),\s*name: Joi\.string\(\)\.required\(\),\s*constituencyId: Joi\.string\(\)\.required\(\),\s*cawId: Joi\.string\(\)\.required\(\),\s*latitude: Joi\.number\(\)\.min\(-90\)\.max\(90\)\.optional\(\),\s*longitude: Joi\.number\(\)\.min\(-180\)\.max\(180\)\.optional\(\),\s*address: Joi\.string\(\)\.max\(500\)\.optional\(\),\s*\}\)/g,
    to: 'schemas.pollingStation',
  },
  {
    from: /Joi\.object\(\{\s*code: Joi\.string\(\)\.optional\(\),\s*name: Joi\.string\(\)\.optional\(\),\s*constituencyId: Joi\.string\(\)\.optional\(\),\s*cawId: Joi\.string\(\)\.optional\(\),\s*latitude: Joi\.number\(\)\.min\(-90\)\.max\(90\)\.optional\(\),\s*longitude: Joi\.number\(\)\.min\(-180\)\.max\(180\)\.optional\(\),\s*address: Joi\.string\(\)\.max\(500\)\.optional\(\),\s*isActive: Joi\.boolean\(\)\.optional\(\),\s*\}\)/g,
    to: 'schemas.pollingStationUpdate',
  },

  // Candidates
  {
    from: /Joi\.object\(\{\s*name: Joi\.string\(\)\.min\(2\)\.max\(100\)\.required\(\),\s*party: Joi\.string\(\)\.max\(100\)\.optional\(\),\s*electionType: Joi\.string\(\)\.valid\([^)]+\)\.required\(\),\s*constituencyId: Joi\.string\(\)\.optional\(\),\s*cawId: Joi\.string\(\)\.optional\(\),\s*\}\)/g,
    to: 'schemas.candidate',
  },
  {
    from: /Joi\.object\(\{\s*name: Joi\.string\(\)\.min\(2\)\.max\(100\)\.optional\(\),\s*party: Joi\.string\(\)\.max\(100\)\.optional\(\),\s*electionType: Joi\.string\(\)\.valid\([^)]+\)\.optional\(\),\s*constituencyId: Joi\.string\(\)\.optional\(\),\s*cawId: Joi\.string\(\)\.optional\(\),\s*isActive: Joi\.boolean\(\)\.optional\(\),\s*\}\)/g,
    to: 'schemas.candidateUpdate',
  },

  // Election Results
  {
    from: /Joi\.object\(\{\s*pollingStationId: Joi\.string\(\)\.optional\(\),\s*candidateId: Joi\.string\(\)\.optional\(\),\s*votes: Joi\.number\(\)\.integer\(\)\.min\(0\)\.optional\(\),\s*spoiltVotes: Joi\.number\(\)\.integer\(\)\.min\(0\)\.optional\(\),\s*\}\)/g,
    to: 'schemas.electionResultUpdate',
  },

  // Incidents
  {
    from: /Joi\.object\(\{\s*pollingStationId: Joi\.string\(\)\.optional\(\),\s*title: Joi\.string\(\)\.min\(5\)\.max\(200\)\.optional\(\),\s*description: Joi\.string\(\)\.max\(1000\)\.optional\(\),\s*incidentType: Joi\.string\(\)\.valid\([^)]+\)\.optional\(\),\s*severity: Joi\.string\(\)\.valid\([^)]+\)\.optional\(\),\s*latitude: Joi\.number\(\)\.min\(-90\)\.max\(90\)\.optional\(\),\s*longitude: Joi\.number\(\)\.min\(-180\)\.max\(180\)\.optional\(\),\s*isResolved: Joi\.boolean\(\)\.optional\(\),\s*\}\)/g,
    to: 'schemas.incidentUpdate',
  },
];

routeFiles.forEach((file) => {
  try {
    let content = fs.readFileSync(file, 'utf8');

    schemaReplacements.forEach(({ from, to }) => {
      content = content.replace(from, to);
    });

    fs.writeFileSync(file, content);
    console.log(`Fixed schemas in ${file}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
});

console.log('Schema fixing complete!');
