# ari-dashboard

Static CSS/JS for a GoHighLevel agency whitelabel dashboard theme, served via jsDelivr.

- `dashboard.css` – theme stylesheet (lossless minified).
- `dashboard.js` – theme scripts; each original block is wrapped in its own try/catch so one failure doesn't stop the rest.

Load pinned to a tag, e.g. `https://cdn.jsdelivr.net/gh/zdsihq/ari-dashboard@v1/dashboard.css`.
Tags are immutable releases: ship changes as a new tag (v2, v3…) rather than moving an existing one.
No secrets or client data live in this repo.

- v3.41: loader change only. Phone loads full dashboard.css/js on every page except Ari Chats (conversations route), which keeps phone-lite; crossing that boundary on phone reloads once (history hook, no timers). Asset files unchanged.
- v3.46: phone Ari Chats green name bar flush with card top; header on own paint layer (flicker); sig marker v46
- v3.47: header tag walks up to the full name row (avatar inside), no paint clip, phone bubbles size to text; marker v47
