// Simple Lighthouse test script
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Lighthouse Performance Test...\n');

// Check if the project structure is correct
const requiredFiles = [
  'package.json',
  'next.config.ts',
  'lighthouserc.js'
];

console.log('📋 Checking project configuration...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} found`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Read and validate lighthouserc.js
console.log('\n🔍 Validating Lighthouse configuration...');
try {
  const config = require('./lighthouserc.js');
  
  console.log('✅ Configuration loaded successfully');
  console.log(`📊 Number of runs: ${config.ci.collect.numberOfRuns}`);
  console.log(`🌐 URLs to test:`);
  config.ci.collect.url.forEach(url => {
    console.log(`   - ${url}`);
  });
  console.log(`🎯 Performance threshold: ${config.ci.assert.assertions['categories:performance'][1].minScore}`);
  console.log(`♿ Accessibility threshold: ${config.ci.assert.assertions['categories:accessibility'][1].minScore}`);
  
} catch (error) {
  console.log(`❌ Configuration error: ${error.message}`);
}

// Check package.json scripts
console.log('\n📜 Available performance scripts:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const perfScripts = Object.keys(packageJson.scripts).filter(script => 
    script.includes('lhci') || script.includes('perf')
  );
  
  perfScripts.forEach(script => {
    console.log(`   ${script}: ${packageJson.scripts[script]}`);
  });
} catch (error) {
  console.log(`❌ Could not read package.json: ${error.message}`);
}

console.log('\n📋 To run the performance audit:');
console.log('1. Install dependencies: npm install');
console.log('2. Build the project: npm run build'); 
console.log('3. Run audit: npm run perf:audit');
console.log('   or use: .\\run-lighthouse.ps1 (PowerShell)');
console.log('   or use: run-lighthouse.bat (Command Prompt)');

console.log('\n✨ Configuration setup complete! Ready for performance testing.');