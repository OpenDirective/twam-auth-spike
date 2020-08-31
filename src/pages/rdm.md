# Hello Regional Development Manager

<!-- markdownlint-disable MD033 -->

Your country is: <span class="country"></span>.

<form id="getapps" action="/.netlify/functions/read-sheet?type=country" method="GET">
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
          <input type="hidden" id="row" name="row" />
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
  const rowData = g_rows[0].filter((r) => r[0] == row)[0]
  const renderer = g_rows[1]

  function completeEdit(event) {
    event.preventDefault()

    const form = event.target
    const endPoint = form.action
    callFunctionWithAuth(endPoint, form).then((columns) => {
      closeModal()
      rowData[5] = columns.status // TODO make this generic
      rowData[6] = columns.evaluation
      renderer()
    }).catch((e)=>{console.log(e.message)})
  }

  function renderEditForm(status, evaluation) {
    const template = document.querySelector('#modal');
    const clone = template.content.firstElementChild.cloneNode(true);
    const form = clone.querySelector("#editrow");
    form.addEventListener("submit", completeEdit, false)
    form.querySelector("#row").value = row
    form.querySelector(`#${status}`).checked = true
    form.querySelector("#evaluation").value = evaluation
    clone.querySelector("[autofocus]").focus()
    return clone
  }

  const clone = renderEditForm(rowData[5], rowData[6])

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

function mkRenderer(where, rows) {
  return () => {
    const div = document.querySelector(where)
    const html = renderTable(rows)
    div.innerHTML = html
  }
}

function getApps(endPoint, where) {
  event.preventDefault()
  callFunctionWithAuth(endPoint).then(({ rows }) => {
    const renderer = mkRenderer(where, rows)
    g_rows = [rows, renderer] // for now we keep the data in memory
    renderer()
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
