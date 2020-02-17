import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./features/App"
import * as serviceWorker from "./serviceWorker"
import fetchIntercept from "fetch-intercept"
import { toast } from "react-toastify"

fetchIntercept.register({
  request: function(url, config) {
    const isDev = process.env.NODE_ENV === "development"
    let newUrl, newConfig
    if (isDev) {
      newUrl = `http://localhost:5000${url}`
    } else {
      newUrl = url
    }

    if (config) {
      newConfig = {
        ...config,
        headers: {
          "content-type": "application/json",
          accept: "application/json"
        }
      }
      if (newConfig.body) {
        newConfig.body = JSON.stringify(newConfig.body)
      }
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
    toast.error(errorResponse.error)
    throw new Error()
  },

  responseError: function(error) {
    return Promise.reject(error)
  }
})

ReactDOM.render(<App />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
