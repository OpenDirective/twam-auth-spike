if (!process.env.NETLIFY) {
  // use .enc file for local dev and assume netlify variables in CI
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
if (!process.env.GOOGLE_SPREADSHEET_ASSIGNMENTS_SHEET_ID)
  throw new Error('no GOOGLE_SPREADSHEET_ASSIGNMENTS_SHEET_ID env var set')
if (!process.env.GOOGLE_SPREADSHEET_ASSIGNMENTS_SHEET_ID)
  throw new Error('no GOOGLE_SPREADSHEET_EMAILS_SHEET_ID env var set')

// TODO switch to decorator pattern and cash doc
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
      row: `=ROW()`,
      ...data,
      file: `=HYPERLINK("${data.file.url}","${data.file.filename}")`,
    }
    const addedRow = await sheet.addRow(row)

    return objectFromRow(sheet.headerValues, addedRow)
  } catch (err) {
    throw err
  }
}

exports.updateApplication = async (rowN, columns) => {
  try {
    const doc = await initDoc()
    const sheet =
      doc.sheetsById[process.env.GOOGLE_SPREADSHEET_APPLICATIONS_SHEET_ID]
    const row = (
      await sheet.getRows({
        offset: rowN - 2,
        limit: 1,
      })
    )[0]

    if (!row) {
      throw new Error('Row not found')
    }

    for (const col in columns) {
      row[col] = columns[col]
    }
    await row.save()

    return objectFromRow(sheet.headerValues, row)
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

const filterResults = (fromColumn, toColumn, keyColumn, keyExpr) => {
  const nrows = `COUNTA(${filter(keyColumn, keyColumn, keyColumn, keyExpr)})`
  const ncolumns = `COLUMNS(${fromColumn}1:${toColumn}1)`

  return {
    headers: `INDIRECT("${sheet}!${fromColumn}1:${toColumn}1")`,
    cells: `IFNA(${filter(
      fromColumn,
      toColumn,
      keyColumn,
      keyExpr,
    )}, {SPLIT(REPT(",-", COLUMNS(${fromColumn}1:${toColumn}1)),",")})`,
    nrows,
    ncolumns,
    columnFilter: `CHAR(COLUMN(Applications!${fromColumn}1:${toColumn}1)+64) <> "${keyColumn}"`, //`{TRUE, TRUE, TRUE}`, // as many rows as in Applications sheet,
    range: `ADDRESS(ROW()+1,COLUMN())&":"&ADDRESS(ROW()+${nrows}+1,COLUMN()+${ncolumns}-2)`,
  }
}

function getApplicationsFilterFormula(fromColumn, toColumn, keyColumn, key) {
  const cells = filterResults(fromColumn, toColumn, keyColumn, '="' + key + '"')
  const row1 = `{${cells.range}, "${key}", SPLIT(REPT(", ", ${cells.ncolumns}-2-1),",")}` // need as many columns as in cells!
  const row2 = `FILTER({${cells.headers};${cells.cells}}, ${cells.columnFilter})`
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
    result[item] = row[item] == undefined ? undefined : row[item].trim()
    return result
  }, {})
}

function parseRoles(roles) {
  return roles.split(',').map((r) => r.trim().toLowerCase())
}

function assignmentObjectFromRow(header, row) {
  const obj = objectFromRow(header, row)
  if (obj.roles) {
    obj.roles = parseRoles(obj.roles)
  }
  return obj
}

exports.getAssignmentForEmail = async function (email) {
  try {
    const doc = await initDoc()
    const sheet =
      doc.sheetsById[process.env.GOOGLE_SPREADSHEET_ASSIGNMENTS_SHEET_ID] // People tab
    const rows = await sheet.getRows()
    const assignmentRow = rows.filter((row) => row.email == email)[0]
    const assignment = assignmentRow
      ? assignmentObjectFromRow(sheet.headerValues, assignmentRow)
      : {}

    return assignment
  } catch (err) {
    throw err
  }
}

exports.getAssignmentForRoleCountry = async function (role, country) {
  try {
    const doc = await initDoc()
    const sheet =
      doc.sheetsById[process.env.GOOGLE_SPREADSHEET_ASSIGNMENTS_SHEET_ID] // People tab
    const rows = await sheet.getRows()
    const assignmentRow = rows.filter(
      (row) => parseRoles(row.roles).includes(role) && row.country == country,
    )[0]
    const assignment = assignmentRow
      ? assignmentObjectFromRow(sheet.headerValues, assignmentRow)
      : {}

    return assignment
  } catch (err) {
    throw err
  }
}

exports.getEmailForEvent = async function (event) {
  try {
    const doc = await initDoc()
    const sheet = doc.sheetsById[process.env.GOOGLE_SPREADSHEET_EMAILS_SHEET_ID] // People tab
    const rows = await sheet.getRows()
    const emailRow = rows.filter((row) => row.event == event)[0]
    if (!emailRow) {
      throw new Error('No email for event ')
    }
    const email = emailRow ? objectFromRow(sheet.headerValues, emailRow) : {}

    return email
  } catch (err) {
    throw err
  }
}

/*
// Version with appropriate Action script in place
exports.readCellsForEdit = async function (row, fromColumn, toColumn) {
  const doc = await initDoc()
  const sheet = doc.sheetsById[process.env.GOOGLE_SPREADSHEET_ASSIGNMENTS_SHEET_ID] // People tab

  await sheet.loadCells(`${fromColumn}${row}:${toColumn}${row}`)
  const c = sheet.getCellByA1(`${fromColumn}${row}`)
  const c2 = sheet.getCellA1(`${toColumn}${row}`)
  console.log(c, c2)
  // return function() {}
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
*/
