// Quiz Template - Mock Version for Deployment
// Temporarily disabled to avoid build errors

import { DesignTokens } from '@/types'

export const quizTemplate = {
  name: 'Quiz Template',
  description: 'Mock quiz template for deployment',
  generateTemplate: (tokens: DesignTokens) => ({
    html: '<div>Quiz Template Mock</div>',
    css: 'body { font-family: Inter; }',
    config: { type: 'quiz' }
  })
}

export default quizTemplate