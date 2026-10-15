# Email alerts for Contact Us messages

## Why no email arrived
The Contact Us form saves each message to the database, but nothing sends an email yet. The project has no sender email domain set up, so it can't send any email right now.

## Step 1 (you): set up the sender domain
Click "Set up email domain" and use newrestaurantsowners.com. It will suggest a sender like notify.newrestaurantsowners.com and show records to add where your domain is managed. Verification can take up to 72 hours. Building can start before it finishes.

## Step 2 (me): send an alert for every message
- Set up the email sending system and an alert email in your brand colors with the sender's name, email, subject and message. The sender's email is set as reply-to, so you can just hit Reply.
- Send every new message to support@newrestaurantsowners.com.
- Add a small unsubscribe page. The system requires it for every email.
- Optional: send the visitor a short "we got your message" confirmation.

## Step 3: test
Send a test message, confirm it reaches support@newrestaurantsowners.com, then delete the test.

## Technical details
- setup_email_infra, then scaffold_transactional_email; template `contact-notification`, with `to` fixed to the support address; reply-to is the submitter.
- Contact.tsx inserts with a client-generated id, then invokes send-transactional-email with idempotencyKey `contact-notify-<id>`.
- Unsubscribe page added at the path the scaffold reports. Deploy edge functions.
