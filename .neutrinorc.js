const { merge } = require('@neutrinojs/compile-loader');

module.exports = {
  use: [
    ['@neutrinojs/airbnb', {
      eslint: {
        fix: true,
      },
    }],
    'neutrino-middleware-styleguidist',
    '@neutrinojs/react-components',
    (neutrino) => {
      if (neutrino.options.legacy) {
        neutrino.config.plugins.delete('clean');
        neutrino.config.output.filename('[name].es5.js');
        neutrino.config.module
          .rule('compile')
            .use('babel')
              .tap(options => merge(options, {
                presets: [
                  ['babel-preset-env', {
                    targets: {
                      ie: 9
                    },
                    useBuiltIns: false,
                    modules: false
                  }]
                ]
              }));
      }
    }
  ],
};
