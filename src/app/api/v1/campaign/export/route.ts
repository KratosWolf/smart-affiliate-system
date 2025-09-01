import { NextRequest, NextResponse } from 'next/server'
import { campaignExporter } from '@/lib/campaigns/csv-export-advanced'

export async function POST(request: NextRequest) {
  try {
    const campaignData = await request.json()
    
    // Generate all CSV files
    const csvFiles = campaignExporter.generateAllCSVs(campaignData)
    
    // Create a combined response with all CSVs
    const response = {
      success: true,
      files: {
        campaigns: {
          filename: 'campaigns.csv',
          content: csvFiles.campaigns,
          instructions: 'Import primeiro - Define a campanha principal'
        },
        adGroups: {
          filename: 'ad-groups.csv', 
          content: csvFiles.adGroups,
          instructions: 'Import segundo - Cria os grupos de anúncios'
        },
        keywords: {
          filename: 'keywords.csv',
          content: csvFiles.keywords,
          instructions: 'Import terceiro - Adiciona palavras-chave'
        },
        ads: {
          filename: 'ads.csv',
          content: csvFiles.ads,
          instructions: 'Import quarto - Cria os anúncios responsivos'
        },
        sitelinks: {
          filename: 'sitelinks.csv',
          content: csvFiles.sitelinks,
          instructions: 'Import quinto - Adiciona sitelinks'
        },
        callouts: {
          filename: 'callouts.csv',
          content: csvFiles.callouts,
          instructions: 'Import sexto - Adiciona callouts'
        },
        snippets: {
          filename: 'snippets.csv',
          content: csvFiles.snippets,
          instructions: 'Import sétimo - Adiciona snippets estruturados'
        }
      },
      importGuide: {
        title: '📋 Guia de Importação para Google Ads',
        steps: [
          '1. Abra o Google Ads Editor',
          '2. Selecione sua conta',
          '3. Vá em "Account" → "Import" → "Import from file"',
          '4. Importe os arquivos NA ORDEM indicada',
          '5. Revise as mudanças',
          '6. Post changes para publicar'
        ],
        tips: [
          '💡 Sempre importe campaigns.csv primeiro',
          '💡 Revise os CPCs antes de publicar',
          '💡 Comece com orçamento baixo para teste',
          '💡 Ative o tracking de conversões antes'
        ]
      }
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to export campaign' 
      },
      { status: 500 }
    )
  }
}