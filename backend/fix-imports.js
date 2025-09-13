const fs = require('fs');
const path = require('path');

const routeFiles = [
  'src/routes/pollingStations.ts',
  'src/routes/constituencies.ts',
  'src/routes/incidents.ts',
  'src/routes/caws.ts',
  'src/routes/candidates.ts',
  'src/routes/electionResults.ts',
  'src/routes/users.ts',
  'src/routes/audit.ts',
];

const replacements = [
  { from: '@/utils/database', to: '../utils/database' },
  { from: '@/utils/logger', to: '../utils/logger' },
  { from: '@/middleware/auth', to: '../middleware/auth' },
  { from: '@/middleware/validation', to: '../middleware/validation' },
  { from: '@/middleware/errorHandler', to: '../utils/AppError' },
];

routeFiles.forEach((file) => {
  try {
    let content = fs.readFileSync(file, 'utf8');

    replacements.forEach(({ from, to }) => {
      content = content.replace(
        new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        to
      );
    });

    fs.writeFileSync(file, content);
    console.log(`Fixed imports in ${file}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
});

console.log('Import fixing complete!');
