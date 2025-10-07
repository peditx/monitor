// This function acts as a secure proxy to the GitHub API.
// It intercepts requests from the frontend, adds the secret GitHub token,
// and forwards them to GitHub. This keeps the token secure on the server.

export async function onRequest(context) {
  // --- Configuration ---
  const GITHUB_API_BASE = "https://api.github.com";

  // Get the path from the incoming request (e.g., /users/peditx/repos)
  const path = context.params.path.join('/');

  // Get the original request's query string (e.g., ?per_page=100)
  const { search } = new URL(context.request.url);

  // Construct the full GitHub API URL
  const githubUrl = `${GITHUB_API_BASE}/${path}${search}`;

  // Get the secret GitHub token from Cloudflare's environment variables
  const githubToken = context.env.GH_PAT;

  if (!githubToken) {
    return new Response("GH_PAT is not set in Cloudflare environment.", {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // --- Make the API request to GitHub ---
  try {
    const response = await fetch(githubUrl, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'PeDitX-Dashboard-Cloudflare-Worker' // Recommended by GitHub
      }
    });

    // --- Return GitHub's response to the frontend ---
    // Create a new response with the same body, status, and status text.
    // We must also include CORS headers to allow the frontend to access this.
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*'); // Allow any origin
    newHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    newHeaders.set('Access-Control-Allow-Headers', 'Content-Type');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });

  } catch (error) {
    return new Response(error.message || 'An unexpected error occurred.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

