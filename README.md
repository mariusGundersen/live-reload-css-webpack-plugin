# live-reload-css-webpack-plugin

A very simple live-reload CSS plugin for webpack

Install it from npm:

```cmd
npm i -D live-reload-css-webpack-plugin
```

And use it in your webpack config file

```js
//webpack.config.js
const LiveReloadPlugin = require('live-reload-css-webpack-plugin');

module.exports = {
  // ...

  plugins: [
    new LiveReloadPlugin({
      entry: 'main', // default
      port: 9876, // default
    })
  ]

  // ...
}
```

## Options

There are two options available, `entry` and `port`.

### entry

This sets the entry file that will get the live-reload client script injected into it. Defaults to `"main"`.

### port

The port that the live-reload server runs on. Defaults to `9876` but you can change it if that conflicts with some other server.
