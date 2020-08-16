# Hello RDM

Your country is: <span class="country"></span>.

<!-- markdownlint-disable MD033 -->
<form id="getapps" action="/.netlify/functions/read-sheet2?type=country" method="GET">
  <p><button type="submit">Get <span class="country"></span> applications</button></p>
</form>

<pre id="rows"></pre>

<script defer>
async function  callFunctionWithAuth(url) {
  const token = netlifyIdentity.currentUser().token.access_token
  const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Authorization': `Bearer ${token}`
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      //    body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
  return response.json(); // parses JSON response into native JavaScript objects
}

function sendForm(event, where) {
  event.preventDefault()
  const funct = event.target.action
  callFunctionWithAuth(funct).then(({rows}) => {
    const div = document.querySelector(where)
    const text= rows.map((row)=>row.toString()).join('\r\n\r\n')
    div.textContent=text
  })
}

const form = document.querySelector('#getapps')
form.onsubmit = (e) => sendForm(e, '#rows')

window.addEventListener('load', onLoad, {once: true})
function onLoad() {
  const country = netlifyIdentity.currentUser().app_metadata.country
  const countryElems = document.querySelectorAll('.country')
  countryElems.forEach(e => {e.textContent = country})
}

</script>
