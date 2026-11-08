# Handoff

Implementation is paused. This file is the release record and the two open items. It does not change assets, the loader, or a tag.

## Release process

1. Plan, then one pull request.
2. Pass desktop Template Brenda and a real iPhone before any release step.
3. Merge and tag only after an explicit owner GO. The parent merges on GitHub.
4. Create one new immutable annotated tag on the exact merge SHA. The name must be unused. Leave an existing tag in place.
5. Confirm raw GitHub and jsDelivr return HTTP 200 and the same bytes as that commit. Match those bytes to `MD5SUMS`.
6. Claude updates the loader, in Zion's working browser only. Jarvis does not edit the GHL loader.

## Current release

`v3.117` is current. Tag object `d4b8c505a5a82e3054a7e1d9e77b422f4b5050ef`. It peels to merge `c462c1cfd25060f8e60edb7a095b0cfaf82ce663`.

Owner reported that Claude applied it: the saved block matched the expected variant, only that block was replaced, and the reload readback of the full saved JS was `008460de4ac70e5a6305d865c3c2a1c2f73cbbaecf82306a06b4bfd56e5824a9`. On a fresh Template Brenda page at `v3.117`, the marker was `s-9090cfb4bfa7`, one bar showed, and the test switch was gone. Owner reported a normal-link real iPhone pass. This repo did not perform those checks.

`dashboard.css` and `dashboard.js` are the sizing bytes from before the readout wrap. The wrap is only in `composer-debug.js`.

Rollback is `v3.116`. Point both asset URLs at `v3.116`, save, read the saved block back, and retest on a fresh page. No new tag. No switch.

## Loader edit

The live loader is one plain dashboard version. It has no `ari_skin` query and no `sessionStorage` test logic. Old flags that remain are inert.

On Zion's working browser:

1. Back up a fresh copy of the saved Custom JS and Custom CSS.
2. Compare the current target block with the expected block. Stop when any other change is present.
3. Keep every unrelated block and byte.
4. Patch only the dashboard block, both version refs.
5. A real keystroke may be required before Save enables.
6. Reload and read the saved script back exactly.
7. Open a fresh full document. A reused SPA view or stale tab does not count.
8. Check both asset URLs, the build marker, one bar, then typing, clear, and long text.

## Marker and composer

`data-ari-build` is a file fingerprint, not the release version. A printed `v3.110` was an old hardcode. The current fingerprint is `s-9090cfb4bfa7`.

At `max-width: 760px` the chat field is a fixed 44px line. Text scrolls inside it. JS does not size it. From `min-width: 761px` the field grows with the text, up to 132px.

WebKit emulation is not a real iOS keyboard. An earlier phone failure was likely a stale reused tab. That was not proven. Leave the cause unstated.

## Debug readout

Use exactly one `ari_debug=composer`. When the URL already has a query, append `&ari_debug=composer`. Remove that parameter and fully reload to turn it off.

With the flag, `dashboard.js` loads sibling `composer-debug.js` from the same released URL. The URL follows the tag. It is not pinned to a commit, unpkg, or `main`. On a phone the overlay wraps. It shows numeric height and top min/max for `f` field, `p` parent, `c` card, and `b` container, plus `visualViewport` height and offset and `scrollY`. Rows store the event type and `inputType` only. No field content, no saved log, no network payload. With the flag absent there is no observer and no extra request.

## Not stock GHL

No stock-GHL flag is implemented. Skipping `dashboard.css` and `dashboard.js` leaves other agency CSS and JS in place, so that skip is not pure GHL. `ari_skin=none` stays reserved and unused. This is a known limit, not new work.

## Paused

Two items stay paused, as separate pull requests, email first, then Memberships. No capture and no implementation in this pause.

Email, phone fit. The read-only DOM note is already on the private `ari-workers` branch `docs/project-docs`, path `docs/claude/capture-email-composer-and-sidebar.md`. Leave that note there. Public selectors already named: `#conv-email-composer-header`, `.from-fields-row`, `#subject-input`, `#mail-composer-container`. CC and BCC control ids stay in the private note. The from-name tag close is a 42x42 green blob. Goal: phone fit, readable fields, and tool spacing, with desktop left as it is. A phone DOM capture is unavailable. Use Zion's iPhone shots plus a read-only working browser. Email stayed still. The chat card was the surface that moved.

Memberships. `a#sb_memberships` was observed with a route ending in `/memberships/client-portal/client-portal-ai`. The intended change is cosmetic and psychic-only: hide that item, and keep admin and non-psychic navigation, including Loyalty. No auth, access, or data change. A psychic-versus-admin signal was proposed and is unverified. A missing nav item is not proof of role. Do not reuse an email hash as authorization. The next implementation waits on a verified scope.

Owner approval gates merge, tag, and any later pull request. The parent coordinates. Work stops after this document.
