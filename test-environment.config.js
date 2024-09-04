const { EnvironmentPlugin } = require('webpack');

module.exports = {
  plugins: [
    new EnvironmentPlugin({
      // defn environment variables here,
      // specify defaults or force user to enter their own with undefined
      APP_API_ENDPOINT: 'fake-url-123',
      RUNTIME: 'test',
    })
  ],
}
