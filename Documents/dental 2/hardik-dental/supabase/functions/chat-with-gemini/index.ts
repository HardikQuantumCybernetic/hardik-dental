// Dental AI Chatbot - v2.0
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// =============================================================================
// CORS
// =============================================================================
// This function is called from the public website, so we allow all origins.
// Do NOT set Allow-Credentials when using '*'.
// =============================================================================

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// =============================================================================
// SECURITY FIX 2: RATE LIMITING
// =============================================================================
// Problem: No rate limiting allows brute-force attacks and API abuse
// Fix: Implement IP-based and user-based rate limiting with configurable limits
// =============================================================================

// In-memory rate limit store (for edge function context)
// Note: For production with multiple instances, use Redis or Supabase table
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

// Configurable via environment variables with sensible defaults
const RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequests: parseInt(Deno.env.get('RATE_LIMIT_MAX_REQUESTS') || '100'),
  windowMs: parseInt(Deno.env.get('RATE_LIMIT_WINDOW_MS') || '60000'), // 1 minute
}

function checkRateLimit(identifier: string): { 
  allowed: boolean
  remaining: number
  resetTime: number 
  retryAfter: number
} {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)
  
  if (!record || now > record.resetTime) {
    // New window
    const resetTime = now + RATE_LIMIT_CONFIG.windowMs
    rateLimitStore.set(identifier, { count: 1, resetTime })
    return { 
      allowed: true, 
      remaining: RATE_LIMIT_CONFIG.maxRequests - 1,
      resetTime,
      retryAfter: 0
    }
  }
  
  if (record.count >= RATE_LIMIT_CONFIG.maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((record.resetTime - now) / 1000)
    return { 
      allowed: false, 
      remaining: 0,
      resetTime: record.resetTime,
      retryAfter
    }
  }
  
  // Increment counter
  record.count++
  return { 
    allowed: true, 
    remaining: RATE_LIMIT_CONFIG.maxRequests - record.count,
    resetTime: record.resetTime,
    retryAfter: 0
  }
}

function getRateLimitHeaders(rateLimit: { remaining: number; resetTime: number }): Record<string, string> {
  return {
    'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
  }
}

// =============================================================================
// OPTIONAL AUTHENTICATION (for rate limiting purposes)
// =============================================================================
// Allow both authenticated and unauthenticated users
// Authenticated users get rate limited by user ID, others by IP
// =============================================================================

interface AuthResult {
  authenticated: boolean
  userId?: string
  identifier: string // Used for rate limiting
}

async function tryAuth(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get('authorization')
  
  // Get client IP for rate limiting fallback
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('cf-connecting-ip') || 
                   'unknown'
  
  if (!authHeader) {
    return { authenticated: false, identifier: `ip:${clientIp}` }
  }
  
  const token = authHeader.replace('Bearer ', '')
  
  if (!token || token === Deno.env.get('SUPABASE_ANON_KEY')) {
    // Just the anon key, not a user token
    return { authenticated: false, identifier: `ip:${clientIp}` }
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })
    
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return { authenticated: false, identifier: `ip:${clientIp}` }
    }
    
    return { authenticated: true, userId: user.id, identifier: `user:${user.id}` }
  } catch (error) {
    console.error('Auth check error:', error)
    return { authenticated: false, identifier: `ip:${clientIp}` }
  }
}

// =============================================================================
// MAIN REQUEST HANDLER
// =============================================================================

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  
  // Only allow POST method
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    // =======================================================================
    // Rate Limiting (by user ID if authenticated, otherwise by IP)
    // =======================================================================
    const authResult = await tryAuth(req)
    const rateLimit = checkRateLimit(authResult.identifier)
    const rateLimitHeaders = getRateLimitHeaders(rateLimit)
    
    if (!rateLimit.allowed) {
      console.warn(`Rate limit exceeded for: ${authResult.identifier}`)
      return new Response(
        JSON.stringify({ 
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds.`,
          retryAfter: rateLimit.retryAfter
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            ...rateLimitHeaders,
            'Retry-After': rateLimit.retryAfter.toString(),
            'Content-Type': 'application/json' 
          } 
        }
      )
    }
    
    // =======================================================================
    // BUSINESS LOGIC
    // =======================================================================
    const { message, context } = await req.json()
    
    // Input validation
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid request', message: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Limit message length to prevent abuse
    const MAX_MESSAGE_LENGTH = 2000
    if (message.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          message: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Use environment variable for API key (secure - never hardcoded)
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key not found in environment variables')
      throw new Error('Gemini API key not configured')
    }

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${context || ''}\n\nPatient Question: ${message}\n\nPlease provide a helpful, professional response about dental care, services, or general oral health information. Keep responses concise and informative.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Gemini API error:', response.status, data)
      
      // Handle quota exceeded errors gracefully
      if (response.status === 429 || data.error?.message?.includes('Quota exceeded')) {
        return new Response(
          JSON.stringify({ 
            response: "I'm currently experiencing high demand. Please try again in a minute, or call our office at (808) 095-0921 for immediate assistance."
          }),
          {
            headers: { 
              ...corsHeaders, 
              ...rateLimitHeaders,
              'Content-Type': 'application/json' 
            },
          },
        )
      }
      
      throw new Error(data.error?.message || 'Failed to get response from Gemini')
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I'm here to help with your dental questions. Please call our office at (808) 095-0921 for specific medical advice."

    console.log(`Request processed successfully for: ${authResult.identifier}`)
    
    return new Response(
      JSON.stringify({ response: generatedText }),
      {
        headers: { 
          ...corsHeaders, 
          ...rateLimitHeaders,
          'Content-Type': 'application/json' 
        },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        response: "I'm experiencing technical difficulties. Please call our office at (808) 095-0921 for assistance."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
