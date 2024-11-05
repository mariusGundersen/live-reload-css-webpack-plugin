
const EventEmitter = require('events');
const http = require('http');
const { DefinePlugin } = require('webpack');

function createSseServer(port = 8789) {
  const events = new EventEmitter();

  const server = http.createServer((req, res) => {
    const listener = (data) => res.write(data);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      Connection: 'keep-alive',
    });

    req.on('close', () => {
      res.end();
      events.off('message', listener);
    });

    res.write('event: open\n\n');

    events.on('message', listener);
  });

  server.listen(port);

  return {
    sendMessage(data) {
      events.emit('message', `event: message\ndata: ${JSON.stringify(data)}\n\n`);
    }
  }
}

module.exports = class LiveReloadPlugin {
  constructor({ entry = 'main', port = 9876 } = {}) {
    this.options = { entry, port };
  }

  apply(compiler) {
    const plugin_name = 'live-reload';

    if (!compiler.options.watch) return;

    compiler.options.entry[this.options.entry].import?.push(require.resolve('./client.js'));

    const sseServer = createSseServer(this.options.port);

    new DefinePlugin({
      ___LIVE_RELOAD_PORT___: this.options.port,
    }).apply(compiler);

    const publicPath = compiler.options.output.publicPath ?? '/';

    compiler.hooks.assetEmitted.tap(plugin_name, (name, info) => {
      console.log('file changed', name);
      sseServer.sendMessage({ asset: publicPath + name });
    });
  }
}