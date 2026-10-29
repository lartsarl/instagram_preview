# Feed Studio

A local Instagram grid planner with an Instagram-inspired dark interface. Requires Node.js 20 or newer, with no third-party packages to install. Open a terminal in this folder and run `node server.mjs` (or `npm start`), then visit http://127.0.0.1:4317.

## Using the planner

Add photos or videos with Add content. New items enter at the beginning of the grid. Select a tile to edit its caption, vertical crop, cover image, or draft/existing status. Drag tiles to reorder them, or use the Move earlier/later buttons. Each tile represents one post; carousel grouping is not implemented yet. Reel playback uses your browser's supported video formats.

Connect Instagram → Import existing posts manually lets you add existing media and mark it as published. The preview uses your chosen ordering; live Instagram pinned posts, hidden reels, and custom grid adjustments are not synced. Follower counts show placeholders until live integration exists.

Media, profile details, and layout are saved in IndexedDB for this browser and this exact address. Keep using the same port and browser. Clearing site data removes the plan. Private browsing may discard data. Export plan saves captions and ordering as JSON, not media, and there is currently no plan import. Keep original files separately. Google Fonts is optional; the layout falls back to local fonts when offline. Media is not uploaded by this app.

## Instagram connection — pending setup

Live Instagram sync is **not implemented or connected** in this version. The connection button opens setup information, not an OAuth login. Your Creator/Business account is eligible for Instagram API with Instagram Login.

Official setup: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/

To implement live sync, create your Meta developer app, enable Instagram Login, configure a redirect URI accepted by Meta (which may require an HTTPS callback), and grant your account the required access/test roles. We then need to implement server-side OAuth state validation, code exchange, token storage/refresh, and paginated media retrieval. The initial read-only integration should request only the applicable basic profile/media permission. App review/access requirements depend on whether other accounts will use it. Keep the app secret and access tokens on the backend, never in browser JavaScript or chat.

No content publishing is implemented. A preview does not guarantee Instagram's exact crop or presentation.
