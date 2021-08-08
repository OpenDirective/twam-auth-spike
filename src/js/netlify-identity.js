const _USERSTATEEVENT = 'userstate'

function addUserStateHandler(fn) {
  window.addEventListener(_USERSTATEEVENT, (e) => {
    fn(e.detail)
  })
}

function initNetlifyIdentity() {
  // NB don't use on init as broken in local devlocal

  netlifyIdentity.setLocale('en')

  function sendStateEvent(state, user) {
    const event = new CustomEvent(_USERSTATEEVENT, { detail: { state, user } })
    window.dispatchEvent(event)
  }

  netlifyIdentity.on('login', (user) => {
    netlifyIdentity.refresh()
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

  netlifyIdentity.on('error', (err) => {
    console.error('Netlify Identity error', err)
  })
}

async function callFunctionWithAuth(url, data, method = 'GET') {
  function getOptions(method, data) {
    const options = {
      method,
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
    throw new Error(`Error calling Function ${url}: ${response.text()}`)
  }
}
