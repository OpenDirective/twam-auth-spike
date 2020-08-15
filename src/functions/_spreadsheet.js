if (!process.env.NETLIFY) {
  // use .enc file for local dev and assume netlify variables in CI
  // TODO can this not be run time?
  require('dotenv').config()
}

const { GoogleSpreadsheet } = require('google-spreadsheet')

if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)
  throw new Error('no GOOGLE_SERVICE_ACCOUNT_EMAIL env var set')
if (!process.env.GOOGLE_PRIVATE_KEY)
  throw new Error('no GOOGLE_PRIVATE_KEY env var set')
if (!process.env.GOOGLE_SPREADSHEET_ID)
  throw new Error('no GOOGLE_SPREADSHEET_ID env var set')
if (!process.env.GOOGLE_SPREADSHEET_APPLICATIONS_SHEET_ID)
  throw new Error('no GOOGLE_SPREADSHEET_APPLICATIONS_SHEET_ID env var set')
if (!process.env.GOOGLE_SPREADSHEET_PEOPLE_SHEET_ID)
  throw new Error('no GOOGLE_SPREADSHEET_PEOPLE_SHEET_ID env var set')

async function initDoc() {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID)

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  })
  await doc.loadInfo()

  return doc
}

exports.addApplication = async (data) => {
  try {
    const doc = await initDoc()
    console.log(data)
    const sheet =
      doc.sheetsById[process.env.GOOGLE_SPREADSHEET_APPLICATIONS_SHEET_ID]
    const addedRow = await sheet.addRow(data)
  } catch (err) {
    throw err
  }
}

exports.getUserApplications = async (email) => {
  const rows = `COUNTA(Applications!B2:B9999)+1`
  const cells = `Filter(INDIRECT("Applications!C2:D"&${rows}), INDIRECT("Applications!B2:B"&${rows})="${email}")`
  const range = `ADDRESS(ROW()+1,COLUMN())&":"&ADDRESS(ROW()+CountA(${cells})-1,COLUMN()+2-1)`
  const row1 = `{${range}, "${email}"}` // need as many columns as in cells!
  const row2 = `${cells}`
  const formula = `={${row1};${row2}}`

  try {
    const doc = await initDoc()
    const sheet = await doc.addSheet()
    const sheetId = sheet.sheetId

    await sheet.loadCells('A1') // Need?
    const cell = sheet.getCell(0, 0)
    cell.formula = formula
    await sheet.saveCells([cell])
    const range = cell.value
    await sheet.loadCells(range)
    const dataCells = [...sheet._cells.slice(1, sheet._cells.length)]
    const rows = dataCells.map((row) =>
      row.map((c) =>
        c._rawData.formattedValue ? c._rawData.formattedValue : '',
      ),
    )

    await doc.deleteSheet(sheetId)

    return rows
  } catch (err) {
    throw err
  }
}

function objectFromRow(header, row) {
  return header.reduce(function (result, item, index) {
    result[item] = row[item].trim().toLowerCase()
    return result
  }, {})
}

function userObjectfromRow(header, row) {
  const obj = objectFromRow(header, row)
  if (obj.roles) {
    obj.roles = obj.roles.split(',').map((r) => r.trim().toLowerCase())
  }
  return obj
}

exports.getUserData = async (email) => {
  try {
    const doc = await initDoc()
    const sheet = doc.sheetsById[process.env.GOOGLE_SPREADSHEET_PEOPLE_SHEET_ID] // People tab

    const rows = await sheet.getRows()
    const userDataRow = rows.filter((row) => row.email == email)[0]
    const userData = userDataRow
      ? userObjectfromRow(sheet.headerValues, userDataRow)
      : {}

    return userData
  } catch (err) {
    throw err
  }
}
