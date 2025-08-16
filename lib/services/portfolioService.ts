import { 
  AboutMeData, 
  PortfolioProject, 
  SkillCategory, 
  CodeExample, 
  GitHubRepository,
  ApiResponse 
} from '../types/portfolio'

class PortfolioService {
  private baseUrl = '/api/portfolio'

  async getAboutData(): Promise<AboutMeData> {
    try {
      const response = await fetch(`${this.baseUrl}/about`)
      const result: ApiResponse<AboutMeData> = await response.json()
      
      if (result.success && result.data) {
        return result.data
      }
      throw new Error(result.message || 'Failed to fetch about data')
    } catch (error) {
      console.error('Error fetching about data:', error)
      throw error
    }
  }

  async getProjects(): Promise<PortfolioProject[]> {
    try {
      const response = await fetch(`${this.baseUrl}/projects`)
      const result: ApiResponse<PortfolioProject[]> = await response.json()
      
      if (result.success && result.data) {
        return result.data.filter(project => project.isActive)
          .sort((a, b) => a.order - b.order)
      }
      throw new Error(result.message || 'Failed to fetch projects')
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  }

  async getSkills(): Promise<SkillCategory[]> {
    try {
      const response = await fetch(`${this.baseUrl}/skills`)
      const result: ApiResponse<SkillCategory[]> = await response.json()
      
      if (result.success && result.data) {
        return result.data.filter(category => category.isActive)
          .sort((a, b) => a.order - b.order)
      }
      throw new Error(result.message || 'Failed to fetch skills')
    } catch (error) {
      console.error('Error fetching skills:', error)
      throw error
    }
  }

  async getCodeExamples(): Promise<CodeExample[]> {
    try {
      const response = await fetch(`${this.baseUrl}/code-examples`)
      const result: ApiResponse<CodeExample[]> = await response.json()
      
      if (result.success && result.data) {
        return result.data.filter(example => example.isActive)
          .sort((a, b) => a.order - b.order)
      }
      throw new Error(result.message || 'Failed to fetch code examples')
    } catch (error) {
      console.error('Error fetching code examples:', error)
      throw error
    }
  }

  async getGitHubRepos(): Promise<GitHubRepository[]> {
    try {
      const response = await fetch(`${this.baseUrl}/github-repos`)
      const result: ApiResponse<GitHubRepository[]> = await response.json()
      
      if (result.success && result.data) {
        return result.data.filter(repo => repo.isActive)
          .sort((a, b) => a.order - b.order)
      }
      throw new Error(result.message || 'Failed to fetch GitHub repositories')
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error)
      throw error
    }
  }

  // Batch fetch all portfolio data
  async getAllPortfolioData() {
    try {
      const [aboutData, projects, skills, codeExamples, githubRepos] = await Promise.all([
        this.getAboutData(),
        this.getProjects(),
        this.getSkills(),
        this.getCodeExamples(),
        this.getGitHubRepos()
      ])

      return {
        aboutData,
        projects,
        skills,
        codeExamples,
        githubRepos
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
      throw error
    }
  }
}

export const portfolioService = new PortfolioService()
export default portfolioService