const plugins = (defaultPlugins) => {
  return defaultPlugins;
};

module.exports = {
  plugins,
  modify: (config, { target, dev }, webpack) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      dns: false,
    };
    return config;
  },
};
