const fs = require('fs');

const files = [
  'src/routes/caws.ts',
  'src/routes/constituencies.ts',
  'src/routes/counties.ts',
  'src/routes/users.ts',
];

files.forEach((file) => {
  try {
    let content = fs.readFileSync(file, 'utf8');

    // Fix double type annotations
    content = content.replace(/\(([^:)]+): any: any\)/g, '($1: any)');
    content = content.replace(/\(([^:)]+): string: any\)/g, '($1: string)');
    content = content.replace(/\(([^:)]+): number: any\)/g, '($1: number)');
    content = content.replace(/\(([^:)]+): boolean: any\)/g, '($1: boolean)');

    fs.writeFileSync(file, content);
    console.log(`Fixed double types in ${file}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
});

console.log('Double type fixing complete!');
