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

## v3.108
v3.101 css + v3.105 collapsed rules + v3.107 icon-row padding + tapped textarea paint-only gold look (radius, background, inset shadow).

## v3.109
v3.101 css + v3.105 and v3.107 rule lines only, no tapped-textarea gold rule.

## v3.110
v3.109 + tapped-box ::before gold overlay (1px, 22px radius, pointer-events none, full gold on focus-within); inner composer outlines set transparent (color only).

## v3.111
Multi-tenant: `window.__ARI_LOCS` allowlist (set in the agency JS loader; unset keeps any-location behaviour). Customers all-list and dash-fix use the current location instead of a hardcoded location id. CSS unchanged from v3.110.

## v3.112
Alerts empty state: Notification Drawer `.blank-list` fills the pane (ivory background, centered “All quiet for now”). JS is v3.111 with the version marker bumped to v3.112.

## v3.113
Alerts empty state: fill height only. Stock emoji and copy kept. v3.112 `.blank-list` rules removed. JS is v3.112 with the version marker bumped to v3.113.

## v3.118
Customer card + Book appointment on phones (Nov 9 2026).
- JS: dash-fix `g()` no longer hides anything inside GHL's `.vue-recycle-scroller` on contacts/detail (hiding rows inside the virtual list made it re-measure and re-render in a loop: lag, jumps, sections opening by themselves). `k.calnew` no longer hides a container that holds the whole booking form (on phones it climbed from the "Internal notes" label to the full form).
- CSS: contact-card hide rule no longer hides `[data-ari-cd-field=empty|platform]` / `[data-ari-cd-folder=empty]` (same virtual-list reason). Phone (<=760px): card row is the only scroll area, full width; empty tab strip hidden; Notes is a green button at bottom right. Book appointment pop-up: full width, columns stacked, footer wraps so Cancel/Book stay on screen.
- Paired agency change: Custom JS turns off "ARI cd-paint2t" (window.__ariPaint stub) and Custom CSS wraps the old cd-phone4 / cd-layout-ru / cd-ios-supports / cd-ios2 blocks in `@media not all` ("ARI cd-phone-off v1").
- v3.118b (same branch): Book appointment pop-up on phones is exactly screen height; the form scrolls inside it and the footer (Status, Cancel, Book appointment) stays pinned at the bottom; inputs 16px so iPhone does not auto-zoom.
