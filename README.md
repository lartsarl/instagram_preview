# Feed Studio

A local Instagram grid planner with an Instagram-inspired dark interface. Requires Node.js 20 or newer, with no third-party packages to install. Open a terminal in this folder and run `node server.mjs` (or `npm start`), then visit http://127.0.0.1:4317.

## Using the planner

Add photos or videos with Add content. New items enter at the beginning of the grid. Select a tile to edit its caption, vertical crop, cover image, or draft/existing status. Drag tiles to reorder them, or use the Move earlier/later buttons. Each tile represents one post; carousel grouping is not implemented yet. Reel playback uses your browser's supported video formats.

Connect Instagram → Import existing posts manually lets you add existing media and mark it as published. The preview uses your chosen ordering; live Instagram pinned posts, hidden reels, and custom grid adjustments are not synced. Follower counts show placeholders until live integration exists.

Media, profile details, and layout are saved in IndexedDB for this browser and this exact address. Keep using the same port and browser. Clearing site data removes the plan. Private browsing may discard data. Export plan saves captions and ordering as JSON, not media, and there is currently no plan import. Keep original files separately. Google Fonts is optional; the layout falls back to local fonts when offline. Media is not uploaded by this app.

## Import an Instagram download without developer registration

Click **Import Instagram archive** in the toolbar. Request an export to your device through Instagram Accounts Center → Your information and permissions → Download/export your information. Select your Instagram profile, Posts and Reels, All time, JSON format, and high media quality. Labels in Instagram may vary.

Unzip the download first. If the download has multiple parts, extract them into one folder preserving the directory structure. Choose that entire folder in Feed Studio. ZIP files and HTML-format metadata are not supported. The importer recognizes posts/reels JSON files, including numbered files and nested `ig_reels_media`, and locates their media by full relative path. It does not import messages or stories.

Drafts stay at the front. New imported posts are sorted newest first ahead of existing published entries; reimporting skips duplicates by source media URI and leaves existing edits/order intact. Captions and timestamps are saved with the first media of each post. Carousel posts remain one tile, showing only their first media; the remaining carousel assets are not stored. Pinned posts, exact grid visibility, and custom reel covers/crops may need manual adjustment. Use the status and reorder controls to refine the result. Missing media and malformed metadata are reported. Storage limits still apply, and clearing browser data removes imported files.

The import runs entirely in your browser. No Facebook account, Meta developer verification, password, or token is needed. This is a manual snapshot rather than live syncing. Run parser checks with `node --test archive.test.mjs`.

## Instagram connection — pending setup

Live Instagram sync is **not implemented or connected** in this version. The connection button opens setup information, not an OAuth login. Your Creator/Business account is eligible for Instagram API with Instagram Login.

Official setup: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/

To implement live sync, create your Meta developer app, enable Instagram Login, configure a redirect URI accepted by Meta (which may require an HTTPS callback), and grant your account the required access/test roles. We then need to implement server-side OAuth state validation, code exchange, token storage/refresh, and paginated media retrieval. The initial read-only integration should request only the applicable basic profile/media permission. App review/access requirements depend on whether other accounts will use it. Keep the app secret and access tokens on the backend, never in browser JavaScript or chat.

No content publishing is implemented. A preview does not guarantee Instagram's exact crop or presentation.
