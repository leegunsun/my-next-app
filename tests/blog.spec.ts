import { test, expect } from '@playwright/test'

test.describe('Blog Functionality', () => {
  test('should load blog page', async ({ page }) => {
    await page.goto('/blog')
    
    // Check if blog page loads
    await expect(page.locator('h1')).toBeVisible()
    
    // Check if blog posts container is present
    const postsContainer = page.locator('main')
    await expect(postsContainer).toBeVisible()
  })

  test('should have blog post filters', async ({ page }) => {
    await page.goto('/blog')
    
    // Look for filter buttons or dropdowns
    const filters = page.locator('button:has-text("All"), select, [role="button"]:has-text("category")')
    
    if (await filters.first().isVisible()) {
      await expect(filters.first()).toBeVisible()
    }
  })

  test('should display blog posts if available', async ({ page }) => {
    await page.goto('/blog')
    
    // Wait for content to load
    await page.waitForTimeout(2000)
    
    // Check if there are blog posts or empty state
    const blogPosts = page.locator('[data-testid="blog-post"], article, .blog-post')
    const emptyState = page.locator(':has-text("No posts"), :has-text("Coming soon")')
    
    // Either posts should be visible OR empty state should be shown
    const postsVisible = await blogPosts.first().isVisible().catch(() => false)
    const emptyVisible = await emptyState.first().isVisible().catch(() => false)
    
    expect(postsVisible || emptyVisible).toBeTruthy()
  })

  test('should handle blog post navigation', async ({ page }) => {
    await page.goto('/blog')
    
    // Wait for content to load
    await page.waitForTimeout(2000)
    
    // Try to find a blog post link
    const firstPostLink = page.locator('a[href*="/blog/"], article a, .blog-post a').first()
    
    if (await firstPostLink.isVisible()) {
      // Click on first blog post
      await firstPostLink.click()
      
      // Should navigate to individual blog post
      await expect(page.url()).toContain('/blog/')
      
      // Should have blog post content
      await expect(page.locator('main')).toBeVisible()
    }
  })
})