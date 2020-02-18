import fetchIntercept from 'fetch-intercept'

let unregisterFetch

function register(token) {
  if (typeof unregisterFetch === 'function') {
    unregisterFetch()
  }
  unregisterFetch = fetchIntercept.register({
    request: function(url, config) {
      const isDev = process.env.NODE_ENV === 'development'
      let newUrl, newConfig

      if (isDev) {
        newUrl = `http://localhost:5000/api${url}`
      } else {
        newUrl = url
      }

      newConfig = {
        ...(config || {}),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      if (newConfig.body) {
        newConfig.body = JSON.stringify(newConfig.body)
      }

      return [newUrl, newConfig]
    },

    requestError: function(error) {
      console.error(error)
      return Promise.reject(error)
    },

    response: async function(response) {
      if (response.ok) {
        try {
          const res = await response.json()
          return res
        } catch (err) {
          return null
        }
      }

      const errorResponse = await response.json()
      console.error(errorResponse)
      throw new Error()
    },

    responseError: function(error) {
      return Promise.reject(error)
    },
  })
}

export { register }
