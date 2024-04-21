const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const plugins = (defaultPlugins) => {
  return defaultPlugins;
};

module.exports = {
  plugins,
  modify: (config, { target, dev }, webpack) => {
    config.plugins.push(new NodePolyfillPlugin());
    config.resolve.fallback = {
      fs: false,
      net: false,
      dns: false,
    };
    return config;
  },
};
