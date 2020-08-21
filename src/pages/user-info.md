# User Info

<!-- markdownlint-disable MD033 -->

currentUser: <pre id="cuser"></pre>

user arg:

<pre id="user-arg"></pre>

<p>JWT:</p>
<pre id="jwt"></pre>

<button id="refresh" onclick="refresh">Refresh JWT</button>

<p>Refreshed JWT:</p>
<pre id="jwt2"></pre>

<script defer>

console.log(g_user)
const user = netlifyIdentity.currentUser()
document.querySelector('#cuser').textContent=JSON.stringify(user)
document.querySelector('#user-arg').textContent= g_user ? JSON.stringify(g_user) : '?'

function refresh() {
  netlifyIdentity.refresh().then((jwt)=>{
    const jwt2El = document.querySelector('#jwt2')
    jwt2El.textContent = jwt
  })
}

</script>
