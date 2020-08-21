# User Info

<!-- markdownlint-disable MD033 -->

User @ init:

<pre id="user-init"></pre>

User @ login:

<pre id="user-login"></pre>

User in localStorage @ pageload:

<pre id="expires"></pre>
<pre id="local-storage"></pre>

<button id="refresh" onclick="refresh()">Refresh JWT</button>

<p>JWT:</p>
<pre id="jwt"></pre>

<script defer>

function format(obj) {
  const exp = new Date(obj.token.expires_at)
  const us = JSON.stringify(obj, null, 2)
  return `${exp}\r\n\r\n${us}`
}
handleUserStateEvent(({user, state}) => {
  if (state == 'init') {
    document.querySelector('#user-init').textContent= user ? format(user) : ''
  }
  else if (state == 'login') {
    document.querySelector('#user-login').textContent= user ? format(user) : ''
  }
  if (state == 'logout') {
    document.querySelector('#user-init').textContent= ''
    document.querySelector('#user-login').textContent= ''
  }
})

const userObj = JSON.parse(localStorage.getItem('gotrue.user'))
document.querySelector('#local-storage').textContent= userObj ? format(userObj) : ''

function refresh() {
  netlifyIdentity.refresh().then((jwt)=>{
    document.querySelector('#jwt').textContent = JSON.stringify(jwt, null, 2)
  })
}



</script>
