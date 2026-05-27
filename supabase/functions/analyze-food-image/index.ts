const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type AnalyzeFoodImageRequest = {
  imageUrl?: string;
  mock?: boolean;
};

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'content-type': 'application/json',
    },
  });
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  let payload: AnalyzeFoodImageRequest = {};

  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Request body must be JSON.' }, 400);
  }

  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  const shouldUseMock = payload.mock !== false;

  if (shouldUseMock || !openAIKey) {
    return jsonResponse(
      {
        mode: 'mock',
        provider: 'mock',
        routeStatus: 'needs_admin_review',
        confidenceScore: 0.72,
        foodNameCandidates: [{ name: 'Mock K-Food Dish', confidence: 0.72 }],
        ingredientCandidates: [{ name: 'mock ingredient', confidence: 0.66 }],
        regionCandidates: [{ name: 'Seoul', confidence: 0.54 }],
        tags: ['mock', 'server-side-boundary'],
        message: openAIKey ? 'Mock mode requested.' : 'OPENAI_API_KEY is not configured.',
      },
      openAIKey ? 200 : 501,
    );
  }

  // Future production implementation:
  // - verify Supabase Auth JWT before processing
  // - enforce per-user and per-IP rate limits
  // - validate image size before any model call
  // - validate image MIME type and extension
  // - block repeated or abusive requests
  // - apply cost controls by user, day, and route
  // - log only sanitized metadata, never image secrets or API keys
  // - call OpenAI from this server-side function, never from Expo client code
  return jsonResponse({
    mode: 'not_implemented',
    provider: 'openai',
    message: 'OpenAI Vision analysis is intentionally deferred for Deployment Phase 1.',
    imageUrlReceived: Boolean(payload.imageUrl),
  }, 501);
});
