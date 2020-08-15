const { GoogleSpreadsheet } = require('google-spreadsheet')

if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)
  throw new Error('no GOOGLE_SERVICE_ACCOUNT_EMAIL env var set')
if (!process.env.GOOGLE_PRIVATE_KEY)
  throw new Error('no GOOGLE_PRIVATE_KEY env var set')
if (!process.env.GOOGLE_SPREADSHEET_ID_FROM_URL)
  throw new Error('no GOOGLE_SPREADSHEET_ID_FROM_URL env var set')

exports.getUserApplications = async (email) => {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID_FROM_URL)

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  })
  await doc.loadInfo()

  const sheet = await doc.addSheet()
  const sheetId = sheet.sheetId

  const rows = `COUNTA(Applications!B2:B9999)+1`
  const cells = `Filter(INDIRECT("Applications!C2:D"&${rows}), INDIRECT("Applications!B2:B"&${rows})="${email}")`
  const range = `ADDRESS(ROW()+1,COLUMN())&":"&ADDRESS(ROW()+CountA(${cells})-1,COLUMN()+2-1)`
  const row1 = `{${range}, "${email}"}` // need as many columns as in cells!
  const row2 = `${cells}`
  const formula = `={${row1};${row2}}`

  try {
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

    doc.deleteSheet(sheetId) // no need to await as we're done

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
    obj.roles = obj.roles.map((r) => r.trim().toLowerCase())
  }
  return obj
}

exports.getUserData = async (email) => {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID_FROM_URL)

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  })
  await doc.loadInfo()
  sheet = doc.sheetsById['384916664'] // People tab

  const rows = await sheet.getRows()
  const userDataRow = rows.filter((row) => row.email == email)[0]
  userData = userDataRow
    ? userObjectfromRow(sheet.headerValues, userDataRow)
    : {}

  try {
    return userData
  } catch (err) {
    throw err
  }
}
