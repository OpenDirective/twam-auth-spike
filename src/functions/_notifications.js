const template = require('lodash.template')

const {
  getAssignmentForRoleCountry,
  getEmailForEvent,
} = require('./_spreadsheet')
const { sendEmail } = require('./_gmail')

// TODO stop template surprises by disabling options
// TODO sanitise data
function parseTemplate(templ, data) {
  const options = { interpolate: /{{([\s\S]+?)}}/g } // mustache style
  const compiled = template(templ, options)
  return compiled(data)
}

function formatDetails(formData) {
  const { ip, user_agent, referer, ...data } = formData
  let str = ''

  for (const [key, value] of Object.entries(data)) {
    str +=
      key == 'file'
        ? value.size
          ? `${key}: ${value.filename + ', ' + value.url}\r\n`
          : ''
        : `${key}: ${value}\r\n`
  }
  return str
}

exports.sendNotification = async function (event, data) {
  try {
    if (!event || !data.country) {
      throw new Error('Event and country must be defined')
    }

    const email = await getEmailForEvent(event)
    const recipient = await getAssignmentForRoleCountry(
      email.recipient,
      data.country,
    )
    if (!recipient.email) {
      throw new Error('Recipient not found for event')
    }

    const templData = {
      ...data,
      ...{
        recipient: email.recipient,
        event,
        details: formatDetails(data),
      },
    }

    const notification = {
      to: recipient.email,
      subject: parseTemplate(email.subject, templData),
      message: parseTemplate(email.message, templData),
    }
    if (email.cc) {
      notification.cc = email.cc
    }
    if (email.bcc) {
      notification.bcc = email.bcc
    }
    return sendEmail(notification)
  } catch (err) {
    console.log(err)
    throw err
  }
}
