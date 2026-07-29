/**
 * Simple API key middleware for protecting Atlas AI endpoints.
 * Set ATLAS_API_KEY in your environment to enable authentication.
 * If no key is configured, authentication is skipped (dev mode).
 */
function apiKeyAuth(req, res, next) {
  const configuredKey = process.env.ATLAS_API_KEY;
  if (!configuredKey) {
    return next(); // auth disabled in dev
  }

  const provided = req.headers['x-api-key'];
  if (!provided || provided !== configuredKey) {
    return res.status(401).json({ error: 'Unauthorized: invalid or missing API key' });
  }

  return next();
}

module.exports = { apiKeyAuth };
