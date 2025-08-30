import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

const youtube = google.youtube('v3')

export async function POST(request: NextRequest) {
  try {
    const { handles } = await request.json()
    const apiKey = process.env.YOUTUBE_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'YouTube API key not configured'
      }, { status: 500 })
    }
    
    console.log('🔍 Converting handles to Channel IDs:', handles)
    
    const results = []
    
    for (const handle of handles) {
      try {
        // Remove @ if present
        const cleanHandle = handle.replace('@', '')
        
        // Try to search for the channel by handle/username
        const searchResponse = await youtube.search.list({
          key: apiKey,
          q: cleanHandle,
          type: ['channel'],
          part: ['snippet'],
          maxResults: 5
        })
        
        if (searchResponse.data.items && searchResponse.data.items.length > 0) {
          // Get the first result (most likely match)
          const channelId = searchResponse.data.items[0].snippet?.channelId
          
          if (channelId) {
            // Get detailed channel info
            const channelResponse = await youtube.channels.list({
              key: apiKey,
              id: [channelId],
              part: ['snippet', 'statistics']
            })
            
            const channel = channelResponse.data.items?.[0]
            if (channel) {
              results.push({
                handle: handle,
                channelId: channel.id,
                title: channel.snippet?.title,
                subscriberCount: parseInt(channel.statistics?.subscriberCount || '0'),
                videoCount: parseInt(channel.statistics?.videoCount || '0'),
                viewCount: parseInt(channel.statistics?.viewCount || '0'),
                customUrl: channel.snippet?.customUrl,
                success: true
              })
              
              console.log(`✅ Found: ${handle} → ${channel.id} (${channel.snippet?.title})`)
            } else {
              results.push({
                handle: handle,
                channelId: null,
                error: 'Channel not found in details',
                success: false
              })
            }
          } else {
            results.push({
              handle: handle,
              channelId: null,
              error: 'No channel ID in search results',
              success: false
            })
          }
        } else {
          results.push({
            handle: handle,
            channelId: null,
            error: 'Channel not found in search',
            success: false
          })
        }
        
        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 200))
        
      } catch (error) {
        console.error(`❌ Error converting ${handle}:`, error)
        results.push({
          handle: handle,
          channelId: null,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        })
      }
    }
    
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)
    
    console.log(`✅ Conversion completed: ${successful.length} successful, ${failed.length} failed`)
    
    return NextResponse.json({
      success: true,
      data: {
        channels: results,
        summary: {
          total: results.length,
          successful: successful.length,
          failed: failed.length
        }
      }
    })
    
  } catch (error) {
    console.error('Channel conversion error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to convert channels'
    }, { status: 500 })
  }
}