/* NOT STOCK. NOT APPLIED. NOT A PURE-GHL SWITCH.
   The query name ari_skin=none is reserved and is not implemented here.
   This file is not loaded by dashboard.js. Executing it changes nothing:
   no requests, no DOM writes, no visibility changes, no remembered choice.
   Skipping dashboard.css and dashboard.js is not stock GHL. A historical
   agency script still has other inline script blocks and style blocks, and
   Agency Custom CSS ownership and injection order are not known from this
   repo. One historical anti-FOUC rule hides the page until .ari-css-ready.
   An exact guard waits on a fresh read-only capture of the saved agency JS,
   the saved Agency Custom CSS, and the live stylesheet node ids and order.
   off stays the stable v3.116 path. none must be explicit on each fresh
   document and must not be stored. */
