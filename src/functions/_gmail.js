if (!process.env.NETLIFY) {
  // use .enc file for local dev and assume netlify variables in CI
  require('dotenv').config()
}

if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)
  throw new Error('no GOOGLE_SERVICE_ACCOUNT_EMAIL env var set')
if (!process.env.GOOGLE_PRIVATE_KEY)
  throw new Error('no GOOGLE_PRIVATE_KEY env var set')
if (!process.env.GMAIL_SENDING_USER)
  throw new Error('no GMAIL_SENDING_USER env var set')

const { JWT } = require('google-auth-library')

// For this to work you must create a service and enable Domain wide delegation for the service
// https://developers.google.com/admin-sdk/directory/v1/guides/delegation
// Set env vars for the service key in GOOGLE_SERVICE_ACCOUNT_EMAIL & GOOGLE_PRIVATE_KEY
// GMAIL_SENDING_USER is the email address that the service delegates for
async function initServiceClient() {
  return new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://mail.google.com/'],
    subject: process.env.GMAIL_SENDING_USER,
  })
}

// email body is to rfc822. (From: is ignored and GMAIL_SENDING_USER used ) eg
// To: someone_else@example.com
// Subject: An RFC 822 formatted message
//
// This is the plain text body of the message. Note the blank line
// between the header information and the body of the message.
exports.sendEmail = async function (emailBody) {
  const client = await initServiceClient()

  // see https://github.com/googleapis/gaxios
  const options = {
    method: 'POST',
    url: `https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send`,
    headers: {
      'Content-Type': 'message/rfc822',
    },
    body: emailBody,
  }
  return await client.request(options)
}
