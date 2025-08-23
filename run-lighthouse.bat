@echo off
echo Installing Lighthouse CI...
npm install

echo Building the application...
npm run build

echo Running Lighthouse CI performance audit...
npx @lhci/cli@0.15.x autorun

echo Performance audit complete!
pause