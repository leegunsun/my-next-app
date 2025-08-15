#!/usr/bin/env node

/**
 * Deploy Firestore Indexes Script
 * 
 * This script helps deploy Firestore indexes required for the blog filtering functionality.
 * It provides instructions and commands to resolve the index error that occurs when
 * filtering blog posts by category.
 */

const fs = require('fs');
const path = require('path');

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RED = '\x1b[31m';

console.log(`\n${BOLD}${BLUE}🔥 Firebase Firestore Index Deployment Helper${RESET}\n`);

// Check if firestore.indexes.json exists
const indexFilePath = path.join(process.cwd(), 'firestore.indexes.json');
if (!fs.existsSync(indexFilePath)) {
  console.error(`${RED}❌ Error: firestore.indexes.json not found in project root${RESET}`);
  process.exit(1);
}

// Read and parse the index file
let indexConfig;
try {
  const indexContent = fs.readFileSync(indexFilePath, 'utf8');
  indexConfig = JSON.parse(indexContent);
} catch (error) {
  console.error(`${RED}❌ Error reading firestore.indexes.json:${RESET}`, error.message);
  process.exit(1);
}

console.log(`${GREEN}✅ Found firestore.indexes.json with ${indexConfig.indexes.length} indexes${RESET}\n`);

// Display current indexes
console.log(`${BOLD}Current Indexes:${RESET}`);
indexConfig.indexes.forEach((index, i) => {
  console.log(`\n${YELLOW}${i + 1}. Collection: ${index.collectionId}${RESET}`);
  console.log('   Fields:');
  index.fields.forEach(field => {
    console.log(`   - ${field.fieldPath} (${field.mode})`);
  });
});

console.log(`\n${BOLD}${BLUE}📋 Deployment Instructions:${RESET}\n`);

console.log(`${BOLD}Option 1: Deploy indexes using Firebase CLI${RESET}`);
console.log(`${GREEN}Recommended for production${RESET}\n`);
console.log('1. Make sure you have Firebase CLI installed:');
console.log(`   ${BLUE}npm install -g firebase-tools${RESET}`);
console.log('\n2. Login to Firebase:');
console.log(`   ${BLUE}firebase login${RESET}`);
console.log('\n3. Deploy the indexes:');
console.log(`   ${BLUE}firebase deploy --only firestore:indexes${RESET}`);

console.log(`\n${BOLD}Option 2: Create indexes manually in Firebase Console${RESET}`);
console.log(`${YELLOW}Use if CLI deployment fails${RESET}\n`);
console.log('1. Open the Firebase Console:');
console.log(`   ${BLUE}https://console.firebase.google.com/project/introduce-me-8569f/firestore/indexes${RESET}`);
console.log('\n2. Click "Create Index" and add the following composite index:');
console.log('   Collection ID: blog-posts');
console.log('   Fields:');
console.log('   - status (Ascending)');
console.log('   - category (Ascending)');
console.log('   - createdAt (Descending)');
console.log('   Query scope: Collection');

console.log(`\n${BOLD}Option 3: Use the error link${RESET}`);
console.log(`${YELLOW}Quick fix using the error message link${RESET}\n`);
console.log('When you see the error in the browser console, it includes a direct link.');
console.log('Click that link to automatically create the required index.\n');

console.log(`${BOLD}${GREEN}✨ After deployment:${RESET}`);
console.log('- Wait 1-2 minutes for the index to be built');
console.log('- Test the blog filter functionality again');
console.log('- The error should be resolved!\n');

console.log(`${BOLD}${BLUE}📚 Additional Notes:${RESET}`);
console.log('- The fallback mechanism in the code will continue to work even without indexes');
console.log('- Indexes improve query performance significantly');
console.log('- Once deployed, indexes are automatically maintained by Firestore\n');