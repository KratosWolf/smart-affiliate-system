// Cookie Template - Mock Version for Deployment
// Temporarily disabled to avoid build errors

export const cookieTemplate = {
  name: 'Cookie Template',
  description: 'Mock cookie template for deployment',
  generateTemplate: () => ({
    html: '<div>Cookie Template Mock</div>',
    css: 'body { font-family: Inter; }',
    config: { type: 'cookie' }
  })
}

export default cookieTemplate