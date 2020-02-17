const rewireReactHotReload = require("react-app-rewire-hot-loader")

module.exports = function override(config, env) {
  config = rewireReactHotReload(config, env)

  config.resolve.alias = {
    ...config.resolve.alias,
    "react-dom": "@hot-loader/react-dom"
  }

  return config
}
