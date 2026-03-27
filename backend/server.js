require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Health check for Render.com deployments
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 3001;

// Route 1: Direct users to GitHub OAuth endpoint
app.get('/auth/github', (req, res) => {
  if (!CLIENT_ID) {
    return res.status(500).send("GitHub CLIENT_ID is not configured in .env");
  }
  const redirectUri = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,read:user`;
  res.redirect(redirectUri);
});

// Route 2: Intercept the GitHub redirect code, swap for token via secret, and drop it back into frontend
app.get('/auth/github/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.redirect(`${FRONTEND_URL}?error=NoCodeProvided`);
  }

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          accept: 'application/json',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
       return res.redirect(`${FRONTEND_URL}?error=TokenExchangeFailed`);
    }

    // Pass token securely via URL parameter back to client router which stores it natively
    res.redirect(`${FRONTEND_URL}?token=${accessToken}`);
  } catch (err) {
    console.error("OAuth Error:", err.message);
    res.redirect(`${FRONTEND_URL}?error=OAuthFailed`);
  }
});

app.listen(PORT, () => {
  console.log(`Backend OAuth Server listening on port ${PORT}`);
});
