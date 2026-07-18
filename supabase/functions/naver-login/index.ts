import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // preflight 요청 처리
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  const clientId = Deno.env.get("NAVER_CLIENT_ID");

  if (!clientId) {
    return Response.json(
      {
        error: "NAVER_CLIENT_ID missing",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }

  const redirectUri =
    "https://vfjvwgjjoedopwgxujvn.supabase.co/functions/v1/naver-callback";

  const url =
    "https://nid.naver.com/oauth2.0/authorize" +
    `?response_type=code` +
    `&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return Response.json(
    {
      url,
    },
    {
      headers: corsHeaders,
    }
  );
});