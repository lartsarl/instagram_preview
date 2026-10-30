# Connect your Meta app

This is an initial Unified Login implementation. Live authorization and media access still need to be verified with your app. It supports connecting and reading media, not publishing, scheduling, insights or webhooks yet.

1. In Meta → Instagram API → Unified Login, try saving this exact Redirect URL: `http://localhost:4317/auth/callback`. Local HTTP acceptance depends on Meta's app settings. If rejected because HTTPS is required, stop and arrange a hosted backend or an approved HTTPS tunnel; do not enter a random placeholder domain. No tunnel is created by this project.
2. Copy the generated Login URL into `META_LOGIN_URL` in `.env`.
3. Open App settings → Basic. Privately copy App Secret into `META_APP_SECRET` in `.env`. Do not send it in chat. The App ID, configuration ID, and Instagram account ID are already prefilled from your setup screenshots. `.env` is ignored by Git and is never served by the web server.
4. Restart the server with `node server.mjs`. Open **http://localhost:4317** for authorization. Existing drafts saved under **127.0.0.1** belong to that separate browser origin; return there for those drafts. Imported data does not migrate between these addresses.
5. Click Connect Instagram → Continue to Meta. Complete authorization with your own account. The callback validates a one-use state bound to an HttpOnly browser cookie and exchanges the code server-side on graph.facebook.com. If Meta rejects the exchange, its new Unified Login requirements may require adjustment; report the visible error without tokens.
6. After returning, click Connect Instagram again → Import latest posts. Each request reads 50 items. Import next page loads more. Remote media URLs can expire; refresh the latest page to update them. Carousel tiles use first media. Existing archive-imported posts are not automatically deduplicated against API posts. Avoid importing the same feed through both methods.

Tokens are kept only in backend memory for at most 24 hours, even if Meta issues a non-expiring system-user token. Restarting the server clears them. Disconnect clears this app's session; revoke access in Meta's connected-app settings to revoke the underlying grant. No tokens appear in browser storage, exports, or logs. `.env` contains your app secret as a local plaintext file: keep it private.

For an HTTPS callback, start and finish login on the same configured HTTPS origin so the transaction cookie is available. Exposing this local server through a tunnel would expose its static UI; session-protected API endpoints still require authorization. Review hosting/access requirements before making it public.

The template can include ad, message and comment permissions. Review Meta's consent screen and grant only assets you intend to connect. This implementation only makes read requests after authorization and does not create posts or ads.
