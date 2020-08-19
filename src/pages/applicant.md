# Welcome Applicant

Please make an application using this form.

<!-- markdownlint-disable MD033 -->
<style>
label > input:required::after {
  content: " *";
  color: red;
}

table {
  border-collapse: collapse;
}

td, th {
  border: 1px solid #999;
  padding: 0.5rem;
  text-align: left;
}

th:nth-child(1),
th:nth-child(2),
td:nth-child(1),
td:nth-child(2) {
  display: none;
}

</style>

<form name="Application" method="POST" data-netlify="true" enctype="multipart/form-data" action="/app-ack">
  <p>
    <label>Your Name:<br/> <input type="text" name="name" readonly /></label>
  </p>
  <p>
    <label>Your Email:<br/> <input type="email" name="email" required /></label>
  </p>
  <p>The country you are in:</p>
  <div>
  <label><input type="radio" id="zambia" name="country" value="zambia" required>Zambia</label>
  </div>
  <div>
    <label><input type="radio" id="uganda" name="country" value="uganda" required>Uganda</label>
  </div>
  <p>
    <label>About yourself / your organisation:<br/> <textarea name="message" required></textarea></label>
  </p>
  <p>
  <label>Choose file to upload:<br/> <input type="file" name="file"></label></p>
  <p>
    <button type="submit">Send</button>
  </p>
  <input type="hidden" name="status" value="open">
</form>

<hr>

<form id="getapps" action="/.netlify/functions/read-sheet2?type=user" method="GET">
  <p><button type="submit">Get My applications</button></p>
</form>

<div id="table"></div>

<script defer>

async function  callFunctionWithAuth(url) {
  const token = netlifyIdentity.currentUser().token.access_token
  const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
  return response.json(); // parses JSON response into native JavaScript objects
}

function hyperlink(cell) {
  const tuple = cell.split(',')
  return `<a href="${tuple[0]}">${tuple[1]}</a>`
  }

function renderRow(row, isHeader) {
  const cells = row.map((c,i) => isHeader ? `<th>${c}</th>` : `<td>${i==4 && c.includes(',') ? hyperlink(c) : c}</td>`);
  return `<tr>${cells.join('')}</tr>`;
}

function renderTable(data) {
  const rows = data.map((r, i) => renderRow(r, i == 0));
  return `<table>\r\n${rows.join('\r\n')}\r\n</table>`;
}

function getApps(endPoint, where) {
  event.preventDefault();
  callFunctionWithAuth(endPoint).then(({ rows }) => {
    const div = document.querySelector(where);
    const html = renderTable(rows);
    div.innerHTML = html;
  });
}
function mkAppsHandler(where) {
  return (e) => {
    const uri = event.target.action;
    getApps(uri, where);
  };
}

function initPage() {

  const form = document.querySelector('#getapps')
  form.onsubmit = mkAppsHandler("#table");

  window.addEventListener('load', onLoad, {once: true})
  function onLoad() {
    const name = netlifyIdentity.currentUser().user_metadata.full_name
    const nameElem = document.querySelector('input[type="text"]')
    nameElem.value = name

    const email = netlifyIdentity.currentUser().email
    const emailElem = document.querySelector('input[type="email"]')
    emailElem.value = email
  }
}

initPage()

</script>
