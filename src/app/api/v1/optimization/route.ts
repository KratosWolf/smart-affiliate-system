import { NextRequest, NextResponse } from 'next/server';
import { characterOptimizer } from '@/lib/optimization/character-optimizer';
import { CharacterOptimizationRequest } from '@/types';
import { getClientIP, logSecurityEvent, RATE_LIMITS } from '@/lib/security';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = getClientIP(request);
  
  try {
    // Parse request body
    const body: CharacterOptimizationRequest = await request.json();
    
    // Validate required fields
    if (!body.content || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Content and type are required' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['headline', 'description', 'display_url'].includes(body.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid optimization type' },
        { status: 400 }
      );
    }

    // TODO: Implement rate limiting
    // const rateLimitKey = getRateLimitKey(clientIP, 'optimization');
    
    // Log optimization request
    logSecurityEvent({
      event: 'character_optimization_requested',
      level: 'low',
      ip: clientIP,
      endpoint: '/api/v1/optimization',
      details: {
        type: body.type,
        contentLength: body.content.length,
        hasKeywords: !!body.keywords?.length
      }
    });

    // Optimize content
    const optimizationResult = await characterOptimizer.optimizeContent(body);
    
    // Log success
    logSecurityEvent({
      event: 'character_optimization_success',
      level: 'low',
      ip: clientIP,
      details: {
        type: body.type,
        originalLength: optimizationResult.characterCount.original,
        optimizedLength: optimizationResult.characterCount.optimized,
        score: optimizationResult.optimizationScore,
        processingTime: Date.now() - startTime
      }
    });

    return NextResponse.json({
      success: true,
      data: optimizationResult,
      meta: {
        processingTime: Date.now() - startTime,
        rateLimit: {
          limit: RATE_LIMITS.optimization.requests,
          remaining: RATE_LIMITS.optimization.requests - 1, // TODO: Implement actual tracking
          reset: Date.now() + RATE_LIMITS.optimization.window * 1000
        }
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Optimization failed';
    
    // Log error
    logSecurityEvent({
      event: 'character_optimization_error',
      level: 'medium',
      ip: clientIP,
      endpoint: '/api/v1/optimization',
      details: {
        error: errorMessage,
        processingTime: Date.now() - startTime
      }
    });

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        meta: {
          processingTime: Date.now() - startTime
        }
      },
      { status: 500 }
    );
  }
}

// Batch optimization endpoint
export async function PUT(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = getClientIP(request);
  
  try {
    // Parse request body - expecting array of optimization requests
    const body: CharacterOptimizationRequest[] = await request.json();
    
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Array of optimization requests required' },
        { status: 400 }
      );
    }

    if (body.length > 10) {
      return NextResponse.json(
        { success: false, error: 'Maximum 10 optimizations per batch' },
        { status: 400 }
      );
    }

    // Validate all requests
    for (const req of body) {
      if (!req.content || !req.type) {
        return NextResponse.json(
          { success: false, error: 'All requests must have content and type' },
          { status: 400 }
        );
      }
    }

    // Log batch optimization request
    logSecurityEvent({
      event: 'batch_optimization_requested',
      level: 'low',
      ip: clientIP,
      endpoint: '/api/v1/optimization',
      details: {
        batchSize: body.length,
        types: body.map(req => req.type)
      }
    });

    // Process batch optimization
    const optimizationResults = await characterOptimizer.batchOptimize(body);
    
    // Log success
    logSecurityEvent({
      event: 'batch_optimization_success',
      level: 'low',
      ip: clientIP,
      details: {
        batchSize: body.length,
        successCount: optimizationResults.length,
        processingTime: Date.now() - startTime
      }
    });

    return NextResponse.json({
      success: true,
      data: optimizationResults,
      meta: {
        batchSize: body.length,
        successCount: optimizationResults.length,
        processingTime: Date.now() - startTime
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Batch optimization failed';
    
    // Log error
    logSecurityEvent({
      event: 'batch_optimization_error',
      level: 'medium',
      ip: clientIP,
      endpoint: '/api/v1/optimization',
      details: {
        error: errorMessage,
        processingTime: Date.now() - startTime
      }
    });

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        meta: {
          processingTime: Date.now() - startTime
        }
      },
      { status: 500 }
    );
  }
}