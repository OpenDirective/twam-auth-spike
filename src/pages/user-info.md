# User Info

<!-- markdownlint-disable MD033 -->

User and jwt:

<pre id="user-login"></pre>

<pre id="expires"></pre>

<button id="refresh" onclick="refresh()">Refresh JWT</button>

<p>New token:</p>
<pre id="jwt"></pre>

<script defer>

function formatToken(token) {
  return JSON.stringify(JSON.parse(atob(token.split('.')[1])), null, 2)
}

function format(obj) {
  const exp = new Date(obj.token.expires_at)
  const expired = new Date() > exp
  const us = JSON.stringify(obj, null, 2)
  const token = formatToken(obj.token.access_token)

  return `${(expired) ? 'EXPIRED!:' : 'Expires:'} ${exp}\r\n\r\n${us}\r\n\r\n${token}`
}

addUserStateHandler(({user, state}) => {
if (state == 'login') {
    document.querySelector('#user-login').textContent= user ? format(user) : ''
  }
  if (state == 'logout') {
    document.querySelector('#user-login').textContent= ''
  }
})

function refresh() {
  netlifyIdentity.refresh().then((jwt)=>{
    document.querySelector('#jwt').textContent = formatToken(jwt)
  })
}

</script>
