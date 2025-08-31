// Review Template - Mock Version for Deployment
// Temporarily disabled to avoid build errors

import { DesignTokens } from '@/types'

export const reviewTemplate = {
  name: 'Review Template',
  description: 'Mock review template for deployment',
  generateTemplate: (tokens: DesignTokens) => ({
    html: '<div>Review Template Mock</div>',
    css: 'body { font-family: Inter; }',
    config: { type: 'review' }
  })
}

export default reviewTemplate