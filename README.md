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
- v3.48: deterministic header row (CENTRALPANEL_NAME) flush green bar, fixed 56px height, gold avatars via CSS
- v3.49: header icons fit 376px bar with ivory/gold icons, name truncates; Contact Details avatar gold via CSS
- v3.50: box head now carries an inline gold style for the Contact Details avatar (.hr-avatar) so it is gold from first paint; JS marker v50; CSS unchanged
- v3.51: phone Ari Chats: GHL inbox icon rail hidden (inbox tools path check no longer depends on stored location id; CSS fallback scoped to html[data-ari-noz]); composer stays one full-width line when expanded; chat header sparkle removed; marker v51
- v3.103: phone typing box taller; gold border wraps text box + icon row so send circle sits inside bottom right (collapsed and tapped); marker v103
- v3.104: tapped phone typing box fills its parent (no 100vw-24px width), fixes composer pushed below screen; marker v104
- v3.105: isolate test variant on v3.101 css (not for live)
- v3.106: isolate test variant on v3.101 css (not for live)
- v3.107: isolate test variant on v3.101 css (not for live)
