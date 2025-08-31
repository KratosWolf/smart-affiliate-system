// Expert Review Template - Mock Version for Deployment
// Temporarily disabled to avoid build errors

import { DesignTokens } from '@/types'

export const expertReviewTemplate = {
  name: 'Expert Review Template',
  description: 'Mock expert review template for deployment',
  generateTemplate: (tokens: DesignTokens) => ({
    html: '<div>Expert Review Template Mock</div>',
    css: 'body { font-family: Inter; }',
    config: { type: 'expert-review' }
  })
}

export default expertReviewTemplate