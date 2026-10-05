# Crystal Cabinet + AI photo analysis

This project contains the Crystal Cabinet frontend and a Vercel serverless endpoint for AI crystal-photo analysis.

## Files
- `index.html` — the app
- `api/analyze.js` — secure AI endpoint; the OpenAI API key stays on the server
- `.env.example` — environment-variable template
- `package.json` — minimal Vercel project package file

## Deploy
1. Put these files in a GitHub repository.
2. Import the repository into Vercel.
3. In Vercel Project Settings → Environment Variables, add `OPENAI_API_KEY` with your OpenAI API key.
4. Optionally set `OPENAI_MODEL` (default: `gpt-6-luna`).
5. Deploy.

Important: do not put your OpenAI API key in `index.html`, GitHub, or browser localStorage.

The endpoint accepts POST JSON with `images` (up to 8 data-URL images) and optional `context`, and returns a structured identification suggestion.

AI identification is a visual aid, not a laboratory-grade mineral identification. Confirm uncertain or valuable specimens with reliable references or an expert.
