const { EnvironmentPlugin } = require('webpack');

require('dotenv').config({
  path: ['.env']
});

module.exports = {
  plugins: [
    new EnvironmentPlugin({
      // defn environment variables here,
      // specify defaults or force user to enter their own with undefined
      APP_API_ENDPOINT: undefined,
      RUNTIME: 'prod',
    })
  ]
}
