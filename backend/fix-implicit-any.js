const fs = require('fs');

const files = [
  'src/routes/audit.ts',
  'src/routes/caws.ts',
  'src/routes/constituencies.ts',
  'src/routes/counties.ts',
  'src/routes/users.ts',
];

const fixes = [
  // Fix map function parameters
  { from: /\.map\(\(([^)]+)\) =>/g, to: '.map(($1: any) =>' },
  // Fix find function parameters
  { from: /\.find\(\(([^)]+)\) =>/g, to: '.find(($1: any) =>' },
  // Fix filter function parameters
  { from: /\.filter\(\(([^)]+)\) =>/g, to: '.filter(($1: any) =>' },
  // Fix forEach function parameters
  { from: /\.forEach\(\(([^)]+)\) =>/g, to: '.forEach(($1: any) =>' },
  // Fix reduce function parameters
  { from: /\.reduce\(\(([^)]+)\) =>/g, to: '.reduce(($1: any) =>' },
];

files.forEach((file) => {
  try {
    let content = fs.readFileSync(file, 'utf8');

    fixes.forEach(({ from, to }) => {
      content = content.replace(from, to);
    });

    fs.writeFileSync(file, content);
    console.log(`Fixed implicit any types in ${file}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
});

console.log('Implicit any fixing complete!');
