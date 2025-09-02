#!/bin/bash

echo "🧪 TESTANDO SISTEMA EM PRODUÇÃO"
echo "================================"

# 1. Health Check
echo -e "\n1️⃣ Health Check:"
curl -s https://smart-affiliate-system.vercel.app/api/health | python3 -m json.tool | head -5

# 2. Discovery Test
echo -e "\n2️⃣ Discovery API:"
curl -X POST https://smart-affiliate-system.vercel.app/api/v1/discovery \
  -H "Content-Type: application/json" \
  -d '{"searchTerm": "weight loss", "country": "US"}' \
  --max-time 10 2>/dev/null | python3 -m json.tool | head -10

# 3. Screenshot Test
echo -e "\n3️⃣ Screenshot API:"
curl -X POST https://smart-affiliate-system.vercel.app/api/v1/screenshots \
  -H "Content-Type: application/json" \
  -d '{"productUrl": "https://example.com", "productName": "test"}' \
  --max-time 10 2>/dev/null | python3 -m json.tool | head -10

echo -e "\n✅ Testes concluídos!"
