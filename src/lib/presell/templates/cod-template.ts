// COD Template - Mock Version for Deployment
// Temporarily disabled to avoid build errors

import { DesignTokens } from '@/types'

export const codTemplate = {
  name: 'COD Template',
  description: 'Mock COD template for deployment',
  generateTemplate: (tokens: DesignTokens) => ({
    html: '<div>COD Template Mock</div>',
    css: 'body { font-family: Inter; }',
    config: { type: 'cod' }
  })
}

export default codTemplate