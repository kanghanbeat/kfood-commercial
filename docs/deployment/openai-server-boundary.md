# OpenAI Server Boundary

OpenAI API keys must stay server-side because Expo Web and React Native client bundles can expose any value referenced by client code. The client must never call OpenAI directly and must never import or read `OPENAI_API_KEY`.

The client should call a Supabase Edge Function instead:

```ts
const { data, error } = await supabase.functions.invoke('analyze-food-image', {
  body: {
    imageUrl,
    mock: true,
  },
});
```

The Edge Function reads `OPENAI_API_KEY` only from Supabase Function secrets with `Deno.env.get("OPENAI_API_KEY")`. For Deployment Phase 1, mock analysis remains the default path when `EXPO_PUBLIC_USE_MOCK_AI=true` or when the server-side key is not configured.

Required future controls:

- Verify Supabase Auth before accepting analysis requests.
- Enforce rate limits per user and request source.
- Validate image size before model calls.
- Validate MIME type and file extension.
- Reject repeated uploads and suspicious request patterns.
- Add logging and monitoring without secret values.
- Add cost caps per user, day, and environment.
- Keep OpenAI calls inside Supabase Edge Functions or trusted server runtimes only.

Reference:

- Expo environment variables: https://docs.expo.dev/guides/environment-variables/
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
