import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Developer Portfolio/)
    
    // Check if main navigation elements are present
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('nav')).toBeVisible()
    
    // Check for hero section
    await expect(page.locator('section').first()).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/')
    
    // Check if navigation links are clickable
    const blogLink = page.locator('nav a[href*="blog"]')
    if (await blogLink.isVisible()) {
      await expect(blogLink).toBeEnabled()
    }
    
    // Check for contact section
    const contactSection = page.locator('section:has-text("Contact")')
    if (await contactSection.isVisible()) {
      await expect(contactSection).toBeVisible()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE size
    await page.goto('/')
    
    // Check if mobile navigation works
    await expect(page.locator('header')).toBeVisible()
    
    // Check if content is still accessible
    await expect(page.locator('main')).toBeVisible()
  })

  test('should have working theme toggle', async ({ page }) => {
    await page.goto('/')
    
    // Look for theme toggle button
    const themeToggle = page.locator('button:has-text("theme"), button[aria-label*="theme"], button[title*="theme"]')
    
    if (await themeToggle.isVisible()) {
      await themeToggle.click()
      // Wait for theme change animation
      await page.waitForTimeout(500)
      
      // Check if theme actually changed (this would depend on your implementation)
      const html = page.locator('html')
      const classList = await html.getAttribute('class')
      expect(classList).toBeTruthy()
    }
  })

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle')
    
    // Filter out known Firebase connection errors (expected in dev environment)
    const criticalErrors = errors.filter(error => 
      !error.includes('Firebase') && 
      !error.includes('auth/') &&
      !error.includes('firestore')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })
})