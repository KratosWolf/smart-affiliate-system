// Alias para /api/v1/campaign (plural -> singular redirect)
// Frontend chama /campaigns (plural), mas API real está em /campaign (singular)

export { POST, GET } from '../campaign/route'