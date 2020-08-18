# Hello RDM

Your country is: <span class="country"></span>.

<!-- markdownlint-disable MD033 -->
<form id="getapps" action="/.netlify/functions/read-sheet2?type=country" method="GET">
  <p><button type="submit">Get <span class="country"></span> applications</button></p>
</form>

<div id="table"></div>

<style>
table {
  border-collapse: collapse;
}

td, th {
  border: 1px solid #999;
  padding: 0.5rem;
  text-align: left;
}
</style>

<script defer>
async function callFunctionWithAuth(url) {
  const token = netlifyIdentity.currentUser().token.access_token;
  const response = await fetch(url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function hyperlink(cell) {
  const tuple = cell.split(',')
  return `<a href="${tuple[0]}">${tuple[1]}</a>`
  }

function renderRow(row, isHeader) {
  const cells = row.map((c,i) => isHeader ? `<th>${c}</th>` : `<td>${i==3 && c ? hyperlink(c) : c}</td>`);
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
  const form = document.querySelector("#getapps");
  form.onsubmit = mkAppsHandler("#table");

  window.addEventListener("load", onLoad, { once: true });
  function onLoad() {
    const country = netlifyIdentity.currentUser().app_metadata.country;
    const countryElems = document.querySelectorAll(".country");
    countryElems.forEach((e) => {
      e.textContent = country;
    });
  }
}

initPage()

</script>
