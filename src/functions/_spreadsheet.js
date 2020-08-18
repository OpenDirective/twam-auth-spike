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

// TODO switch to decorator pattern
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
    const sheet =
      doc.sheetsById[process.env.GOOGLE_SPREADSHEET_APPLICATIONS_SHEET_ID]
    const row = {
      ...data,
      file: `=HYPERLINK("${data.file.url}","${data.file.filename}")`,
    }
    const addedRow = await sheet.addRow(row)
    return addedRow._rowNumber - 1
  } catch (err) {
    throw err
  }
}

const filledColumns = (nStr, str) => `SPLIT(REPT(",${str}", ${nStr}),",")`
const sheet = 'Applications'
const allRows = `COUNTA(${sheet}!B2:B9999)`
const range = (fromColumn, toColumn) =>
  `INDIRECT("${sheet}!${fromColumn}2:${toColumn}"&${allRows}+1)`
const filter = (fromColumn, toColumn, exprColumn, expression) =>
  `FILTER(${range(fromColumn, toColumn)}, ${range(
    exprColumn,
    exprColumn,
  )} ${expression})`
const filterResults = (fromColumn, toColumn, exprColumn, expr) => ({
  headers: `INDIRECT("${sheet}!${fromColumn}1:${toColumn}1")`,
  cells: `IFNA(${filter(
    fromColumn,
    toColumn,
    exprColumn,
    expr,
  )}, {SPLIT(REPT(",-", COLUMNS(${fromColumn}1:${toColumn}1)),",")})`,
  nrows: `COUNTA(${filter(exprColumn, exprColumn, exprColumn, expr)})`,
  ncolumns: `COLUMNS(${fromColumn}1:${toColumn}1)`,
})

function getApplicationsFilterFormula(fromColumn, toColumn, keyColumn, key) {
  const cells = filterResults(fromColumn, toColumn, keyColumn, '="' + key + '"')
  const cellsRange = `ADDRESS(ROW()+1,COLUMN())&":"&ADDRESS(ROW()+${cells.nrows}+1,COLUMN()+${cells.ncolumns}-2)`
  const row1 = `{${cellsRange}, "${key}", SPLIT(REPT(", ", ${cells.ncolumns}-3),",")}` // need as many columns as in cells!
  const row2 = `FILTER({${cells.headers};${cells.cells}}, CHAR(COLUMN(Applications!${fromColumn}1:${toColumn}1)+64) <> "${keyColumn}")`
  const formula = `={${row1};${row2}}`
  return formula
}

exports.getFilteredApplications = async function (
  fromColumn,
  toColumn,
  keyColumn,
  key,
) {
  const formula = `${getApplicationsFilterFormula(
    fromColumn,
    toColumn,
    keyColumn,
    key,
  )}`

  const doc = await initDoc()
  const sheet = await doc.addSheet()
  const sheetId = sheet.sheetId

  await sheet.loadCells('A1:B1')
  const cell = sheet.getCell(0, 0)
  cell.formula = formula
  await sheet.saveCells([cell])
  const range = cell.value
  await sheet.loadCells(range)
  const cell2 = sheet.getCell(0, 1)
  const dataCells = [...sheet._cells.slice(1, sheet._cells.length)] // skip range
  const rows = dataCells.map((row) => {
    return row.map((c) => {
      const raw = c._rawData
      return raw.hyperlink
        ? `${raw.hyperlink},${raw.formattedValue}`
        : raw.formattedValue
        ? raw.formattedValue
        : ''
    })
  })
  await doc.deleteSheet(sheetId)

  return rows
}

function objectFromRow(header, row) {
  return header.reduce(function (result, item, index) {
    result[item] = row[item].trim().toLowerCase()
    return result
  }, {})
}

function userObjectFromRow(header, row) {
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
      ? userObjectFromRow(sheet.headerValues, userDataRow)
      : {}

    return userData
  } catch (err) {
    throw err
  }
}

// handler for debug in local dev
exports.handler = async (event, context) => {
  try {
    const result = await exports.getCountryApplications('zambia')

    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    }
  } catch (err) {
    console.error('error ocurred in processing ', event)
    console.error(err)
    return {
      statusCode: 500,
      body: err.toString(),
    }
  }
}
