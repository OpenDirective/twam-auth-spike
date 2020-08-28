const { sendEmail } = require('./_gmail')

exports.handler = async (event, context) => {
  try {
    const email = `To: steve@fullmeasure.co.uk
Subject: Hello

Hello from me`

    const response = await sendEmail(email)

    https: console.log('rrr', response)

    return {
      statusCode: 200,
    }
  } catch (err) {
    console.error('error ocurred in sending', err, event)
    return {
      statusCode: 500,
      body: err.toString(),
      headers: { 'Content-Type': 'text/plain' },
    }
  }
}
