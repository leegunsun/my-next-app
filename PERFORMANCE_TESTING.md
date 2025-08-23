# Performance Testing with Lighthouse CI

## Overview
This project is configured with Lighthouse CI for comprehensive web performance testing. Lighthouse analyzes your web application for performance, accessibility, best practices, and SEO.

## Quick Start

### Option 1: Using PowerShell (Recommended)
```powershell
.\run-lighthouse.ps1
```

### Option 2: Using Batch Script
```cmd
run-lighthouse.bat
```

### Option 3: Manual Commands
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Run Lighthouse audit
npm run perf:audit
```

## What Gets Tested

The Lighthouse CI configuration tests three key URLs:
- **Homepage**: `http://localhost:3000` - Main portfolio page
- **Admin Area**: `http://localhost:3000/admin` - Admin interface
- **Dev Gate**: `http://localhost:3000/dev-gate` - Development access control

## Performance Thresholds

### Core Web Vitals
- **First Contentful Paint (FCP)**: ≤ 2.0s (Warning threshold)
- **Interactive (TTI)**: ≤ 5.0s (Warning threshold) 
- **Speed Index**: ≤ 3.0s (Warning threshold)
- **Largest Contentful Paint (LCP)**: ≤ 2.5s (Warning threshold)

### Quality Scores (0.0 - 1.0 scale)
- **Performance**: ≥ 0.8 (Warning threshold)
- **Accessibility**: ≥ 0.9 (Error threshold) 
- **Best Practices**: ≥ 0.9 (Warning threshold)
- **SEO**: ≥ 0.9 (Warning threshold)

## Understanding Results

### Performance Metrics
- **FCP**: Time until first text/image appears
- **LCP**: Time until largest element loads
- **TTI**: Time until page is fully interactive
- **CLS**: Visual stability during loading
- **Speed Index**: Visual completeness speed

### Report Locations
After running the audit, reports are uploaded to temporary public storage. The CLI will provide URLs to:
- **HTML Reports**: Visual, detailed performance analysis
- **JSON Reports**: Raw data for programmatic analysis

## Configuration Details

### Lighthouse RC Configuration (`lighthouserc.js`)
- **Server Startup**: Automatically starts Next.js production server
- **Multiple Runs**: 5 runs per URL for statistical accuracy
- **Chrome Flags**: Optimized for CI environments
- **Desktop Preset**: Tests desktop performance characteristics

### Available Scripts
- `npm run lhci`: Run complete Lighthouse audit
- `npm run lhci:collect`: Only collect performance data
- `npm run lhci:assert`: Only run assertions against thresholds
- `npm run lhci:upload`: Only upload results to storage
- `npm run perf:audit`: Build and run complete audit

## Optimization Recommendations

### Performance Issues to Watch For
1. **Large Bundle Sizes**: Check for unused dependencies
2. **Unoptimized Images**: Use Next.js Image component
3. **Missing Preloading**: Add rel="preload" for critical resources
4. **Render Blocking**: Minimize main thread blocking
5. **Third-party Scripts**: Audit Firebase and analytics impact

### Next.js Specific Optimizations
- Use `next/image` for automatic image optimization
- Implement `next/font` for font optimization
- Enable static generation where possible
- Use `next/dynamic` for code splitting
- Implement proper caching headers

### Firebase Performance Impact
- Monitor Firebase SDK bundle size impact
- Use tree shaking to include only used Firebase features
- Consider Firebase performance monitoring integration
- Optimize Firestore queries for minimal data transfer

## Troubleshooting

### Common Issues
1. **Server Startup Failures**: Check if port 3000 is available
2. **Chrome Launch Failures**: Ensure Chrome/Chromium is installed
3. **Build Failures**: Run `npm run build` manually first
4. **Network Timeouts**: Check internet connectivity for uploads

### Environment Requirements
- Node.js 16+ 
- Chrome/Chromium browser
- Internet connection (for result uploads)
- Available port 3000

## Advanced Usage

### Custom Configuration
Edit `lighthouserc.js` to:
- Add more URLs to test
- Adjust performance thresholds  
- Change assertion rules
- Modify Chrome launch options

### CI/CD Integration
The configuration supports:
- GitHub Actions
- GitLab CI
- CircleCI  
- Travis CI
- Jenkins

### Local Development
For ongoing performance monitoring:
```bash
# Run in development mode (less strict)
npx lhci collect --url=http://localhost:3000 --settings.preset=mobile

# Quick performance check
npx lighthouse http://localhost:3000 --view
```

## Performance Budget Integration

Consider adding a `budget.json` file for resource budgets:
```json
{
  "resourceSizes": [
    {"resourceType": "document", "budget": 14},
    {"resourceType": "stylesheet", "budget": 31},
    {"resourceType": "script", "budget": 31}
  ],
  "resourceCounts": [
    {"resourceType": "third-party", "budget": 10}
  ]
}
```

## Next Steps

1. **Run Initial Audit**: Use the provided scripts
2. **Analyze Results**: Review generated reports
3. **Implement Fixes**: Address high-impact issues first
4. **Monitor Regularly**: Set up automated testing
5. **Set Team Goals**: Define performance standards