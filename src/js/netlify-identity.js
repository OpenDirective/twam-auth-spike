const _USERSTATEEVENT = 'userstate'

function handleUserStateEvent(fn) {
  window.addEventListener(_USERSTATEEVENT, (e) => {
    fn(e.detail)
  })
}

function initNetlifyIdentity() {
  // TODO - handle init followed by login
  netlifyIdentity.setLocale('en')

  function sendStateEvent(state, user) {
    const event = new CustomEvent(_USERSTATEEVENT, { detail: { state, user } })
    window.dispatchEvent(event)
  }

  netlifyIdentity.on('init', (user) => {
    sendStateEvent('init', user)
  })

  netlifyIdentity.on('login', (user) => {
    netlifyIdentity.close()
    sendStateEvent('login', user)
  })

  netlifyIdentity.on('logout', (user) => {
    netlifyIdentity.close()
    sendStateEvent('logout', user)
  })

  function handleEsc(e) {
    if (e.key == 'Escape') {
      netlifyIdentity.close()
    }
  }
  netlifyIdentity.on('open', (_) => {
    document.body.addEventListener('keydown', handleEsc)
  })
  netlifyIdentity.on('close', (_) => {
    document.body.removeEventListener('keydown', handleEsc)
  })

  netlifyIdentity.on('error', (err) => console.error('Error', err))
}
