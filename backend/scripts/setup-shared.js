const fs = require('fs');
const path = require('path');

// Try multiple possible locations for the shared package
const possiblePaths = [
  path.resolve(__dirname, '../shared/src'),
  path.resolve(__dirname, '../../shared/src'),
  path.resolve(process.cwd(), '../shared/src'),
  path.resolve(process.cwd(), '../../shared/src'),
];

const targetDir = path.resolve(__dirname, '../node_modules/@bitcoinvillagex/shared');
const targetSrc = path.join(targetDir, 'src');

// Find the shared source directory
let sharedSrcPath = null;
for (const possiblePath of possiblePaths) {
  if (fs.existsSync(possiblePath)) {
    sharedSrcPath = possiblePath;
    console.log(`Found shared package at: ${sharedSrcPath}`);
    break;
  }
}

if (!sharedSrcPath) {
  console.error('ERROR: Shared package source not found in any expected location:');
  possiblePaths.forEach(p => console.error(`  - ${p}`));
  console.error('\nPlease ensure the shared package is available in the build context.');
  process.exit(1);
}

// Create target directory
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy package.json if it exists
const sharedPackageJson = path.resolve(sharedSrcPath, '../../package.json');
if (fs.existsSync(sharedPackageJson)) {
  fs.copyFileSync(sharedPackageJson, path.join(targetDir, 'package.json'));
  console.log('Copied shared package.json');
}

// Copy source files
function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(sharedSrcPath, targetSrc);
console.log(`Successfully copied shared package to: ${targetDir}`);

