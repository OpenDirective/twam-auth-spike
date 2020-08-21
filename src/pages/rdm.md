# Hello RDM

<!-- markdownlint-disable MD033 -->

Your country is: <span class="country"></span>.

<form id="getapps" action="/.netlify/functions/read-sheet2?type=country" method="GET">
  <p><button type="submit">Get <span class="country"></span> applications</button></p>
</form>

<div id="table"></div>

<template id="modal">
  <div id="modalContainer">
    <div class="modal-background" onclick="closeModal"></div>
    <div class="modal" role="dialog" aria-modal="true" >
      <form id="editrow" action="/.netlify/functions/update-app" method="PUT">
        <p>Application status:</p>
        <div>
          <label><input type="radio" id="pending" name="status" value="pending" required>pending</label>
        </div>
        <div>
          <label><input type="radio" id="accepted" name="status" value="accepted" required>accepted</label>
        </div>
        <div>
          <label><input type="radio" id="rejected" name="status" value="rejected" required>rejected</label>
        </div>
        <p>
          <label>Evaluation:<br/> <textarea id="evaluation" name="evaluation" required></textarea></label>
        </p>
        <p>
          <button type="submit">OK</button>
        </p>
      </form>
      <button autofocus onclick="closeModal()">Cancel</button>
    </div>
  </div>
</template>

<style>
table {
  border-collapse: collapse;
}

td, th {
  border: 1px solid #999;
  padding: 0.5rem;
  text-align: left;
}

th:nth-child(7),
td:nth-child(7) {
  display: none;
}

.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
}

.modal {
  position: absolute;
  left: 50%;
  top: 50%;
  width: calc(100vw - 4em);
  max-width: 32em;
  max-height: calc(100vh - 4em);
  overflow: auto;
  transform: translate(-50%,-50%);
  padding: 1em;
  border-radius: 0.2em;
  background: white;
}

</style>

<script defer>
async function callFunctionWithAuth(url, method="GET", data={}) {
  const token = netlifyIdentity.currentUser().token.access_token
  const body = (method == "PUT") ? {body: JSON.stringify(data)} : {}
  console.log(data, method, body)
  const response = await fetch(url, {
    method, // *GET, POST, PUT, DELETE, etc.
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    ...body
  })
  return response.json() // parses JSON response into native JavaScript objects
}

function closeModal()
{
  window.removeEventListener("keydown", onKeydown)
  const modal = document.querySelector('#modalContainer')
  modal.parentNode.removeChild(modal)
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    closeModal();
    return;
  }

  if (e.key === 'Tab') {
    // trap focus
    const modal = document.querySelector(`[role="dialog"]`)
    const nodes = modal.querySelectorAll('*');
    const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);

    let index = tabbable.indexOf(document.activeElement);
    if (index === -1 && e.shiftKey) index = 0;

    index += tabbable.length + (e.shiftKey ? -1 : 1);
    index %= tabbable.length;

    tabbable[index].focus();
    e.preventDefault();
  }
};

let g_rows = []

function editRow(row) {
  rowData = g_rows.filter((r) => r[0] == row)[0]

  function completeEdit(event) {
    event.preventDefault()

    const data = new FormData(event.target)
    const form = event.target
    const endPoint = form.action
    const method = form.attributes.getNamedItem('method').value // frm.method is always 'get'
    callFunctionWithAuth(endPoint, method, data).then(() => {
      closeModal()
    })

  }

  const template = document.querySelector('#modal');
  const clone = template.content.firstElementChild.cloneNode(true);
  const autofocus = clone.querySelector("[autofocus]");
  const form = clone.querySelector("#editrow");
  form.addEventListener("submit", completeEdit, false)
  const statusElem = clone.querySelector(`#${rowData[5]}`)
  statusElem.checked = true
  const evaluation = clone.querySelector("#evaluation")
  evaluation.value = rowData[6]

  autofocus.focus()
  window.addEventListener("keydown", onKeydown)

  const body = document.querySelector("body");
  body.appendChild(clone)

 }

function hyperlink(cell) {
  const tuple = cell.split(',')
  return `<a href="${tuple[0]}">${tuple[1]}</a>`
  }

function renderRow(row, isHeader) {
  const cells = row.map((c,i) => isHeader ? `<th>${c}</th>` : `<td>${i==4 && c.includes(',') ? hyperlink(c) : c}</td>`)
  const editBtnCell = isHeader ? '<th></th>' : `<td><button onclick="editRow(${row[0]})">edit</button></td>`
  return `<tr data-row="${row[0]}">${cells.join('')}${editBtnCell}</tr>`
}

function renderTable(data) {
  const rows = data.map((r, i) => renderRow(r, i == 0))
  return `<table>\r\n${rows.join('\r\n')}\r\n</table>`
}

function getApps(endPoint, where) {
  event.preventDefault()
  callFunctionWithAuth(endPoint).then(({ rows }) => {
    const div = document.querySelector(where)
    const html = renderTable(rows)
    g_rows = rows // for now we keep the data in memory
    div.innerHTML = html
  })
}

function mkAppsHandler(where) {
  return (e) => {
    const uri = event.target.action
    getApps(uri, where)
  }
}

function initPage() {
  const form = document.querySelector("#getapps")
  form.onsubmit = mkAppsHandler("#table")

  window.addEventListener("load", onLoad, { once: true })
  function onLoad() {
    const country = netlifyIdentity.currentUser().app_metadata.country
    const countryElems = document.querySelectorAll(".country")
    countryElems.forEach((e) => {
      e.textContent = country
    })
  }
}

initPage()

</script>
