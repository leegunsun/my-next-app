module.exports = {
  ci: {
    collect: {
      // URLs to test
      url: [
        'http://localhost:3000',
        'http://localhost:3000/admin',
        'http://localhost:3000/dev-gate'
      ],
      // Start Next.js production server
      startServerCommand: 'npm run start',
      // Wait for server to be ready
      startServerReadyPattern: 'ready|listening|started',
      startServerReadyTimeout: 30000,
      // Number of runs to ensure consistent results  
      numberOfRuns: 5,
      settings: {
        // Next.js optimizations for better accuracy
        preset: 'desktop',
        // Disable storage reset for faster collection
        disableStorageReset: false,
        // Timeout settings
        maxWaitForLoad: 45000,
        // Chrome flags for performance testing
        chromeFlags: '--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage'
      }
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Performance thresholds for Next.js app
        'first-contentful-paint': ['warn', {maxNumericValue: 2000}],
        'interactive': ['warn', {maxNumericValue: 5000}], 
        'speed-index': ['warn', {maxNumericValue: 3000}],
        'largest-contentful-paint': ['warn', {maxNumericValue: 2500}],
        
        // Accessibility requirements
        'categories:accessibility': ['error', {minScore: 0.9}],
        
        // Best practices
        'categories:best-practices': ['warn', {minScore: 0.9}],
        
        // SEO requirements
        'categories:seo': ['warn', {minScore: 0.9}],
        
        // Performance category
        'categories:performance': ['warn', {minScore: 0.8}],
        
        // Disable some audits that might not apply to portfolio sites
        'uses-rel-preconnect': 'off',
        'tap-targets': 'off'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};