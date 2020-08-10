# Welcome Applicant

Please make an application using this form.

<!-- markdownlint-disable MD033 -->
<style>
  label > input:required::after {
    content: " *";
    color: red;
  }

</style>

<form name="Application" method="POST" data-netlify="true" action="/app-ack">
  <p>
    <label>Your Name:<br/> <input type="text" name="name" required /></label>
  </p>
  <p>
    <label>Your Email:<br/> <input type="email" name="email" required /></label>
  </p>
  <p>
    <label>About yourself / your organisation:<br/> <textarea name="message"   required></textarea></label>
  </p>
  <p>
    <button type="submit">Send</button>
  </p>
</form>

<form id="getit" action="/.netlify/functions/read-sheet" method="GET">
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

function fs(event) {
  event.preventDefault()
  const funct = event.target.action
  callFunctionWithAuth(funct).then(({rows}) => {
    const div = document.querySelector('#rows')
    const text= rows.map((row)=>row.toString()).join('\r\n\r\n')
    div.textContent=text
  })
}

const form = document.querySelector('#getit')
form.onsubmit = fs

</script>
