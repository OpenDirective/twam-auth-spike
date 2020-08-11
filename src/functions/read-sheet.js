exports.handler = async (event, context) => {
  const {
    user: { email },
  } = context.clientContext

  const fetch = require('node-fetch')

  const API_ENDPOINT =
    'https://script.google.com/macros/s/AKfycby9IHg3awfiHQF8zuRFRGFUqfAkMSOajMRXbF3PemYKvAPjABg/exec'
  const url = `${API_ENDPOINT}?email=${encodeURIComponent(email)}`
  console.log(url)
  return fetch(url, { headers: { Accept: 'application/json' } })
    .then((response) => response.text())
    .then((text) => ({
      statusCode: 200,
      body: text,
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }))
}
