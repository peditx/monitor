/**
 * This is a more robust Cloudflare Pages Function to act as a secure proxy to the GitHub API.
 * It includes detailed logging to help diagnose issues with environment variables or requests.
 */
export async function onRequest(context) {
    const GITHUB_API_BASE = "https://api.github.com";
    
    // Log that the function was triggered
    console.log("Proxy function invoked.");

    // Extract the full GitHub API path from the request URL's query string.
    // Example request from frontend: /github-proxy?path=users/PeDitX/repos
    const url = new URL(context.request.url);
    const apiPath = url.searchParams.get('path');

    if (!apiPath) {
        console.error("Error: 'path' query parameter is missing.");
        return new Response("API path is missing in the request.", { status: 400 });
    }

    // Get the secret GitHub token from Cloudflare's environment variables.
    const githubToken = context.env.GH_PAT;

    if (!githubToken) {
        // This log is crucial. If you see this, the secret is not set correctly in Cloudflare.
        console.error("CRITICAL: Environment variable GH_PAT is not found!");
        return new Response("Server configuration error: GitHub token is missing.", { status: 500 });
    } else {
        console.log("Successfully loaded GH_PAT secret.");
    }

    // Reconstruct the original query string, removing our 'path' param.
    url.searchParams.delete('path');
    const queryString = url.searchParams.toString();
    
    const githubUrl = `${GITHUB_API_BASE}/${apiPath}?${queryString}`;
    console.log(`Forwarding request to GitHub: ${githubUrl}`);

    try {
        const response = await fetch(githubUrl, {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'PeDitX-Dashboard-Cloudflare-Proxy-v2'
            }
        });

        // Create a new response to add CORS headers, allowing the frontend to read it.
        const newHeaders = new Headers(response.headers);
        newHeaders.set('Access-Control-Allow-Origin', '*');
        
        console.log(`Received status ${response.status} from GitHub.`);

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });

    } catch (error) {
        console.error("Error fetching from GitHub API:", error);
        return new Response("Failed to fetch from GitHub API.", { status: 502 });
    }
}
