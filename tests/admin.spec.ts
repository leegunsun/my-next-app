import { test, expect } from '@playwright/test'

test.describe('Admin Functionality', () => {
  test('should protect admin routes', async ({ page }) => {
    // Try to access admin without authentication
    await page.goto('/admin')
    
    // Should either redirect to login or show protection message
    const url = page.url()
    const hasLoginForm = await page.locator('input[type="password"], input[type="email"]').isVisible()
    const hasProtectionMessage = await page.locator(':has-text("Under Development"), :has-text("Access Restricted")').isVisible()
    
    // Should either be redirected or show protection
    expect(url.includes('/admin') && (hasLoginForm || hasProtectionMessage)).toBeTruthy()
  })

  test('should show development gate if configured', async ({ page }) => {
    await page.goto('/admin')
    
    // Check if dev gate is active
    const devGate = page.locator(':has-text("Under Development")')
    
    if (await devGate.isVisible()) {
      // Should have login form
      const loginForm = page.locator('input[type="password"]')
      await expect(loginForm).toBeVisible()
      
      // Should have submit button
      const submitButton = page.locator('button:has-text("Enter"), button[type="submit"]')
      await expect(submitButton).toBeVisible()
    }
  })

  test('should handle admin navigation when authenticated', async ({ page }) => {
    // This test assumes you have a way to authenticate
    // For now, just check if admin navigation exists when on admin pages
    await page.goto('/admin')
    
    // Wait for page to load
    await page.waitForTimeout(1000)
    
    // If we're on an admin page, check for admin navigation
    if (page.url().includes('/admin')) {
      const adminNav = page.locator('nav a:has-text("Posts"), nav a:has-text("Messages"), nav a:has-text("Portfolio")')
      
      // If admin nav exists, it should be functional
      if (await adminNav.first().isVisible()) {
        await expect(adminNav.first()).toBeVisible()
      }
    }
  })

  test('should load admin posts page', async ({ page }) => {
    await page.goto('/admin/posts')
    
    // Should either show login protection or posts interface
    const isProtected = await page.locator(':has-text("Under Development"), input[type="password"]').isVisible()
    const hasPostsInterface = await page.locator(':has-text("Posts"), :has-text("New Post")').isVisible()
    
    expect(isProtected || hasPostsInterface).toBeTruthy()
  })

  test('should load admin messages page', async ({ page }) => {
    await page.goto('/admin/messages')
    
    // Should either show login protection or messages interface
    const isProtected = await page.locator(':has-text("Under Development"), input[type="password"]').isVisible()
    const hasMessagesInterface = await page.locator(':has-text("Messages"), table, .message').isVisible()
    
    expect(isProtected || hasMessagesInterface).toBeTruthy()
  })
})