/**
 * --------------------------------------------------------------------------
 * M A G O S   N O D E   S E R V E R   C O N S T R U C T
 * --------------------------------------------------------------------------
 * Target: Serving VOR.jsx (Client Logic)
 * Function: Static Asset Service & Environment Injection
 * Status: Sanctified
 * --------------------------------------------------------------------------
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

// [Configuration] Initialize the Spirit
const app = express();
const PORT = process.env.PORT || 3000;

// [Secrets] The Sacred Firebase Config
// Ideally, these are pulled from the environment (.env) to keep the spirit pure.
// Replace these placeholders with your actual connection rituals.
const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your-app.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "your-app-id",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-app.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "00000000000",
  appId: process.env.FIREBASE_APP_ID || "1:00000000:web:0000000000"
};

const APP_ID = process.env.APP_ID || 'default-app-id';

// [Middleware] Serve static compiled assets (CSS, JS images)
// Assumes your built React files are in a 'build' or 'dist' directory.
app.use(express.static(path.join(__dirname, 'dist')));

// [Route] The Primary Interface
// This endpoint handles all requests, returning the HTML shell.
// It performs the Rite of Injection, placing the config directly into the global scope.
app.get('*', (req, res) => {
  const templatePath = path.join(__dirname, 'dist', 'index.html');

  // If the compiled shell does not exist, warn the Magos.
  if (!fs.existsSync(templatePath)) {
    return res.status(500).send(`
      <h1 style="font-family: monospace; color: red;">[ERROR] Auspex Scan Failed</h1>
      <p>The 'dist/index.html' artifact is missing. Initiate build sequence.</p>
    `);
  }

  // Read the HTML template
  fs.readFile(templatePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('[CRITICAL] Stasis Field Failure:', err);
      return res.status(500).send('Internal Spirit Failure');
    }

    // [Injection] The Rite of Environment Imprinting
    // We inject the global variables window.__firebase_config and window.__app_id
    // so the React component (VOR.jsx) can consume them immediately upon hydration.
    const injectionScript = `
      <script>
        window.__firebase_config = '${JSON.stringify(FIREBASE_CONFIG)}';
        window.__app_id = '${APP_ID}';
      </script>
    `;

    // Inject before the closing </head> or <body> tag
    const sanctifiedHtml = htmlData.replace(
      '</head>',
      `${injectionScript}</head>`
    );

    res.send(sanctifiedHtml);
  });
});

// [Ignition] Awaken the Machine Spirit
app.listen(PORT, () => {
  console.log(`
    +-------------------------------------------+
    |  M E C H A N I C U S   O N L I N E        |
    +-------------------------------------------+
    |  Cogitator Port: ${PORT}                     |
    |  Protocol: HTTP                           |
    |  Status: Operational                      |
    +-------------------------------------------+
  `);
});