const _USERSTATEEVENT = 'userstate'

function handleUserStateEvent(fn) {
  window.addEventListener(_USERSTATEEVENT, (e) => {
    fn(e.detail)
  })
}

function initNetlifyIdentity() {
  console.log(netlifyIdentity.CurrentUser())
  netlifyIdentity.currentUser() && netlifyIdentity.refresh()

  netlifyIdentity.setLocale('en')

  function sendStateEvent(state, user) {
    const event = new CustomEvent(_USERSTATEEVENT, { detail: { state, user } })
    window.dispatchEvent(event)
  }

  // TODO - handle init followed by login
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

async function callFunctionWithAuth(url, data, method = 'GET') {
  function getOptions(method, data) {
    const options = {
      ...{ method },
      ...(data instanceof HTMLFormElement
        ? {
            body: new URLSearchParams([...new FormData(data)]),
            method: data.attributes.getNamedItem('method').value, // frm.method is always 'get' when using a Template element in Ffx
          } // Content-Type is set for us
        : typeof data == 'string'
        ? { body: data }
        : typeof data == 'object'
        ? {
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
          }
        : {}),
    }

    const token = netlifyIdentity.currentUser().token.access_token
    options.headers = {
      ...(options.headers ? options.headers : {}),
      ...{ Authorization: `Bearer ${token}` },
    }

    return options
  }

  const response = await fetch(url, getOptions(method, data))
  if (response.ok) {
    return response.json()
  } else {
    throw Error(`Error updating sheet: ${response.text()}`)
  }
}
