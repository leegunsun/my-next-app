@echo off
echo Installing missing dependencies for the portfolio website...
echo.

echo Installing framer-motion for animations...
npm install framer-motion --save

echo Installing lucide-react for icons...
npm install lucide-react --save

echo Installing react-intersection-observer for scroll animations...
npm install react-intersection-observer --save

echo Installing clsx and tailwind-merge for utility classes...
npm install clsx tailwind-merge --save

echo.
echo All dependencies installed successfully!
echo You can now run: npm run dev
echo.
pause