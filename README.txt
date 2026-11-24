TISBURY PD OFFICER APP  (standalone, no server needed)
Current version: 20261124b (shown at the bottom of the app; also VERSION in sw.js and APP_VER in index.html). This repo (tpdofficer) is the main copy.
tpdofficerv2 was merged into it on Nov 3 and again on Nov 24, 2026.

ADDRESSES
  GitHub Pages:  https://jgoeckel13-collab.github.io/tpdofficer/
  (The Cloudflare tpd-officer worker was deleted Nov 24, 2026. GitHub Pages is the only address.)

PUT ON GITHUB PAGES
  1. Upload everything in this folder (including .nojekyll) to the top level of the repository.
  2. Settings > Pages > Deploy from a branch > main / (root). Open the address it shows.
  3. On the device: browser menu > Install app / Add to Home screen.

UPDATING
  Upload the new files, then change VERSION on line 2 of sw.js AND APP_VER (plus APP_NOTES, the "what's new" text) in index.html.
  Devices reload on their own and show "Updated to version ..." once.

EMAIL
  The officer app never sends email by itself. Email officer opens the device's mail app
  with the PDF attached and the selected officer(s) in To.

RECENT FORMS
  Completed forms stay on the device for 24 hours, then are deleted automatically:
  at the 24-hour mark while the app is open, whenever the app is reopened, and (installed
  Android/Chrome app) by background clean-up. "Delete all now" on the home page clears them at once.

FORMS INCLUDED (grouped in folders on the home page)
  Motor Vehicle: Minor MV Crash Worksheet (photos), Motor Vehicle Inventory (photos),
    Vehicle Lockout Request, Child Car Seat Check (label scan, photos)
  Lost & Found Property: Lost / Found Property Report
  Statements & Consent: Voluntary Statement, Consent to Search, Decline to Prosecute
  209A & 258E Orders: 209A Complaint, 209A Order, 209A Notice of Rights,
    209A / 258E Return of Service, 258E Order
  Details: Detail Request Form, Detail Voucher
  Other: Trespass Notice, Request for Information, and Portuguese versions
