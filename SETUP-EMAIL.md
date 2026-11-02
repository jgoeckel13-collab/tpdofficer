# Automatic email for the GitHub apps

Pick **one** sending service. Then in each app (kiosk and officer, on each device):
**Staff setup > Email sending** > enter the service address and key > **Save** > **Send test email**.

With a service set, step 5 works automatically:
- **Print / Sent to officer** prints and emails the PDF to the officer(s) picked on the sign screen.
- **Want a copy?** emails the visitor only. Replies bounce (they can't reach the sender mailbox).

With no service, or when the device is offline, both open an email on the device instead.

---

## Option 1 - Google Apps Script (free, no PC needed)

Emails are sent **from the Gmail account you create the script in** (for example a dedicated `tisburypd.noreply@gmail.com`).

1. Sign in to that Gmail account, then go to **https://script.google.com** > **New project**.
2. Delete the sample code and paste in everything from `TPD-Mail-Sender.gs`.
3. Edit the **SETTINGS** at the top:
   - `KEY` - make up a long random password (20+ characters). You'll type it into each app.
   - `SENDER_NAME` - e.g. `TPD Kiosk`.
   - `ALLOWED_OFFICERS` - who officer emails may go to: full addresses, or a whole domain like `'@tisburyma.gov'`. Anything else is refused, so the public app can't be used to email strangers.
   - `CC` - copied on every officer email (or `''`).
4. Click **Save** (disk icon). Name the project "TPD Mail Sender".
5. **Deploy > New deployment** > gear icon > **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - **Deploy**. Google asks for permission: **Authorize access** > choose the account > **Advanced** > **Go to TPD Mail Sender (unsafe)** > **Allow**. ("Unsafe" only means Google hasn't reviewed your own script.)
6. Copy the **Web app URL** (ends in `/exec`). That is the **service address** for the apps.

Changing the script later: edit, Save, then **Deploy > Manage deployments** > pencil > Version: **New version** > Deploy. The address stays the same.

Limits on a regular Gmail account: about 100 recipients per day; attachments up to 25 MB.

---

## Option 2 - your TPD Central server

1. In the server's Visitor app: **Staff setup > Email sending** (email sending must already work there).
2. Under **GitHub apps**:
   - **Key** - 16+ characters; enter the same key in each GitHub app.
   - **Allowed app websites** - your GitHub Pages address, e.g. `https://yourname.github.io`.
   - **Extra allowed officer addresses** - optional; officers saved on the server are always allowed.
   - **Save**.
3. Service address in the apps: `https://<your server address>/api/relay`

The server must be reachable **over HTTPS** from wherever the apps are used (for officers in the field, that means the VPN or secure tunnel IT sets up). A GitHub Pages app cannot call a plain `http://` address.
