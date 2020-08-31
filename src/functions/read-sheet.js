const { getFilteredApplications } = require('./_spreadsheet')

async function getUserApplications(email) {
  try {
    const rows = await getFilteredApplications('A', 'G', 'C', email) // Need B as is removed
    return rows
  } catch (err) {
    throw err
  }
}

async function getCountryApplications(country) {
  try {
    const rows = await getFilteredApplications('A', 'H', 'D', country)
    return rows
  } catch (err) {
    throw err
  }
}

exports.handler = async (event, context) => {
  const {
    user: { email },
    user: {
      app_metadata: { country },
    },
  } = context.clientContext
  const {
    queryStringParameters: { type },
  } = event

  try {
    const rows = await (type == 'country'
      ? getCountryApplications(country)
      : type == 'user'
      ? getUserApplications(email)
      : new Promise((resolve) => {
          resolve([])
        }))

    const result = JSON.stringify({ rows })
    return {
      statusCode: 200,
      body: result,
      headers: { 'Content-Type': 'application/json' },
    }
  } catch (err) {
    console.error('error ocurred in processing ', event)
    console.error(err)
    return {
      statusCode: 500,
      body: err.toString(),
      headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
    }
  }
}

/*
// Version using Apps Script
exports.handler = async (event, context) => {
  const {
    user: { email },
  } = context.clientContext

  const fetch = require('node-fetch')

  const API_ENDPOINT =
    'https://script.google.com/macros/s/AKfycby9IHg3awfiHQF8zuRFRGFUqfAkMSOajMRXbF3PemYKvAPjABg/exec'
  const url = `${API_ENDPOINT}?email=${encodeURIComponent(email)}`

  return fetch(url, { headers: { Accept: 'application/json' } })
    .then((response) => response.text())
    .then((text) => ({
      statusCode: 200,
      body: text,
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }))
}

*/
