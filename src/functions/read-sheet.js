const { GoogleSpreadsheet } = require('google-spreadsheet')

exports.handler = async (event, context) => {
  /*
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID_FROM_URL)

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  })
  await doc.loadInfo()
  const sheet = doc.sheetsByIndex[0]

  try {
    await sheet.loadCells()
    .then((c) => console.log('c', c))
    return {
      statusCode: 200,
      body: 'hello',
    }
  } catch (err) {
    console.error('error ocurred in processing ', event)
    console.error(err)
    return {
      statusCode: 500,
      body: err.toString(),
    }
  }
*/
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
