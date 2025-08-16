// GitHub API utilities
import { GitHubRepository } from '../types/portfolio'

export interface GitHubAPIRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  pushed_at: string
  html_url: string
  clone_url: string
  created_at: string
  size: number
  open_issues_count: number
  watchers_count: number
  default_branch: string
  private: boolean
  fork: boolean
  archived: boolean
  disabled: boolean
  has_issues: boolean
  has_projects: boolean
  has_wiki: boolean
  has_pages: boolean
  has_downloads: boolean
  license: {
    key: string
    name: string
    spdx_id: string
    url: string
    node_id: string
  } | null
  owner: {
    login: string
    id: number
    avatar_url: string
    html_url: string
  }
}

/**
 * Map GitHub API repository data to our GitHubRepository interface
 */
export function mapGitHubAPIToRepository(apiRepo: GitHubAPIRepository, order: number = 0): GitHubRepository {
  return {
    id: `github-${apiRepo.id}`,
    name: apiRepo.name,
    description: apiRepo.description || '설명이 없습니다.',
    language: apiRepo.language || 'Unknown',
    stars: apiRepo.stargazers_count,
    forks: apiRepo.forks_count,
    lastUpdated: apiRepo.updated_at.split('T')[0], // Convert to YYYY-MM-DD format
    url: apiRepo.html_url,
    isActive: !apiRepo.archived && !apiRepo.disabled, // Active if not archived or disabled
    order: order,
    createdAt: apiRepo.created_at,
    updatedAt: new Date().toISOString()
  }
}

/**
 * Fetch repositories from GitHub API
 */
export async function fetchGitHubRepositories(username: string): Promise<GitHubRepository[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }
    
    const apiRepos: GitHubAPIRepository[] = await response.json()
    
    // Filter out forks and map to our interface
    const repositories = apiRepos
      .filter(repo => !repo.fork && !repo.archived) // Exclude forks and archived repos
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()) // Sort by most recent
      .map((repo, index) => mapGitHubAPIToRepository(repo, index + 1))
    
    return repositories
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error)
    throw error
  }
}

/**
 * Get repository details for a specific repository
 */
export async function fetchGitHubRepository(username: string, repoName: string): Promise<GitHubRepository | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`)
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }
    
    const apiRepo: GitHubAPIRepository = await response.json()
    return mapGitHubAPIToRepository(apiRepo)
  } catch (error) {
    console.error('Error fetching GitHub repository:', error)
    return null
  }
}

/**
 * Check if we can reach GitHub API
 */
export async function checkGitHubAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch('https://api.github.com/octocat', { 
      method: 'HEAD',
      cache: 'no-cache'
    })
    return response.ok
  } catch (error) {
    console.error('GitHub API health check failed:', error)
    return false
  }
}