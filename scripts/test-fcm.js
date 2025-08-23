const { chromium } = require('playwright');

async function testFCMButtonClick() {
    console.log('🚀 Starting FCM test...');
    
    // Launch browser
    const browser = await chromium.launch({ 
        headless: false,  // Show browser for debugging
        slowMo: 1000     // Slow down actions for better visibility
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Array to store network requests
    const fcmRequests = [];
    const allRequests = [];
    
    // Monitor all network requests
    page.on('request', request => {
        const url = request.url();
        allRequests.push({
            url: url,
            method: request.method(),
            timestamp: new Date().toISOString()
        });
        
        // Check for FCM related requests
        if (url.includes('fcm') || 
            url.includes('firebase') || 
            url.includes('messaging') ||
            url.includes('googleapis.com/v1/projects') ||
            url.includes('fcmtoken')) {
            fcmRequests.push({
                url: url,
                method: request.method(),
                headers: request.headers(),
                timestamp: new Date().toISOString()
            });
            console.log('🔥 FCM related request detected:', url);
        }
    });
    
    page.on('response', response => {
        const url = response.url();
        if (url.includes('fcm') || 
            url.includes('firebase') || 
            url.includes('messaging') ||
            url.includes('googleapis.com/v1/projects')) {
            console.log('📨 FCM response:', response.status(), url);
        }
    });
    
    try {
        console.log('🌐 Navigating to localhost:3000...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        
        // Wait for page to load completely
        await page.waitForTimeout(3000);
        
        // Take initial screenshot
        await page.screenshot({ path: 'fcm-test-initial.png', fullPage: true });
        console.log('📸 Initial screenshot taken');
        
        // Look for the message send button (multiple possible selectors)
        const buttonSelectors = [
            'button:has-text("메시지 보내기")',
            'button:has-text("메시지")',
            'button:has-text("보내기")',
            '[data-testid*="message"]',
            '[data-testid*="send"]',
            'button[class*="message"]',
            'button[class*="send"]'
        ];
        
        let messageButton = null;
        
        for (const selector of buttonSelectors) {
            try {
                messageButton = await page.locator(selector).first();
                if (await messageButton.count() > 0) {
                    console.log(`✅ Found button with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continue to next selector
            }
        }
        
        if (!messageButton || await messageButton.count() === 0) {
            console.log('🔍 Button not found with specific selectors, searching all buttons...');
            
            // Get all buttons and their text
            const allButtons = await page.locator('button').all();
            console.log(`Found ${allButtons.length} buttons on the page`);
            
            for (let i = 0; i < allButtons.length; i++) {
                const button = allButtons[i];
                const text = await button.textContent();
                console.log(`Button ${i + 1}: "${text}"`);
                
                if (text && (text.includes('메시지') || text.includes('보내기'))) {
                    messageButton = button;
                    console.log(`✅ Found message button: "${text}"`);
                    break;
                }
            }
        }
        
        if (messageButton && await messageButton.count() > 0) {
            console.log('🎯 Found message send button, preparing to click...');
            
            // Clear previous requests to focus on button click
            fcmRequests.length = 0;
            
            // Scroll to button if needed
            await messageButton.scrollIntoViewIfNeeded();
            
            // Take screenshot before clicking
            await page.screenshot({ path: 'fcm-test-before-click.png', fullPage: true });
            
            console.log('👆 Clicking message send button...');
            await messageButton.click();
            
            // Wait for potential network requests
            await page.waitForTimeout(5000);
            
            // Take screenshot after clicking
            await page.screenshot({ path: 'fcm-test-after-click.png', fullPage: true });
            
        } else {
            console.log('❌ Message send button not found');
            
            // Take screenshot of current page for debugging
            await page.screenshot({ path: 'fcm-test-no-button.png', fullPage: true });
            
            // Log all text content for debugging
            const bodyText = await page.textContent('body');
            console.log('Page text content:', bodyText.substring(0, 500) + '...');
        }
        
    } catch (error) {
        console.error('❌ Error during test:', error);
        await page.screenshot({ path: 'fcm-test-error.png', fullPage: true });
    }
    
    // Final results
    console.log('\n📊 Test Results:');
    console.log(`Total network requests: ${allRequests.length}`);
    console.log(`FCM related requests: ${fcmRequests.length}`);
    
    if (fcmRequests.length > 0) {
        console.log('\n🔥 FCM Requests detected:');
        fcmRequests.forEach((req, index) => {
            console.log(`${index + 1}. ${req.method} ${req.url}`);
            console.log(`   Time: ${req.timestamp}`);
        });
    } else {
        console.log('\n⚠️  No FCM requests detected');
        console.log('Recent requests (last 10):');
        allRequests.slice(-10).forEach((req, index) => {
            console.log(`${index + 1}. ${req.method} ${req.url}`);
        });
    }
    
    await browser.close();
    
    return {
        fcmRequestsFound: fcmRequests.length > 0,
        fcmRequests: fcmRequests,
        totalRequests: allRequests.length,
        buttonFound: messageButton !== null
    };
}

// Run the test
testFCMButtonClick()
    .then(result => {
        console.log('\n✅ Test completed');
        console.log('Result:', result.fcmRequestsFound ? 'FCM requests detected' : 'No FCM requests');
        process.exit(result.fcmRequestsFound ? 0 : 1);
    })
    .catch(error => {
        console.error('💥 Test failed:', error);
        process.exit(1);
    });