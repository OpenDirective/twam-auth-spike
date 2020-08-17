# Welcome Applicant

Please make an application using this form.

<!-- markdownlint-disable MD033 -->
<style>
  label > input:required::after {
    content: " *";
    color: red;
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
</form>

<hr>

<form id="getapps" action="/.netlify/functions/read-sheet2?type=user" method="GET">
  <p><button type="submit">Get My applications</button></p>
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
  const name = netlifyIdentity.currentUser().user_metadata.full_name
  const nameElem = document.querySelector('input[type="text"]')
  nameElem.value = name

  const email = netlifyIdentity.currentUser().email
  const emailElem = document.querySelector('input[type="email"]')
  emailElem.value = email
}

</script>
