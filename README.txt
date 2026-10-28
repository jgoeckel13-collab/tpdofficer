TISBURY PD OFFICER APP  (standalone, no server needed)

PUT ON GITHUB PAGES
  1. Create a GitHub repository, upload everything in this folder (including .nojekyll), to the top level.
  2. Settings > Pages > Deploy from a branch > main / (root). Open the address it shows.
  3. On the device: browser menu > Install app / Add to Home screen.

UPDATING
  Upload the new files, then change VERSION on line 2 of sw.js. Devices reload on their own.

EMAIL
  Without any setup, Email officer opens the device's mail app with the PDF attached.
  To send automatically, follow apps-script/SETUP-EMAIL.md, or point the app at the
  TPD Central server relay (/api/relay) - see the Central README.

FORMS INCLUDED: Detail Voucher, Motor Vehicle Inventory (with photos), Motor Vehicle Crash Worksheet (with photos),
  Lockout, Voluntary Statement and the other built-in forms. The officer app keeps filled forms 24 hours.
