module.exports = {
  use: [
    ['@neutrinojs/airbnb', {
      eslint: {
        fix: true,
      },
    }],
    'neutrino-middleware-styleguidist',
    ['@neutrinojs/react-components', {
      babel: {
        presets: [
          ['babel-preset-env', {
            targets: {
              ie: 9,
            },
            useBuiltIns: false,
            modules: false,
          }],
        ],
      },
    }],
  ],
};


// module.exports = {
//   use: [
//     'neutrino-preset-react-components',
//     (neutrino) => {
//       neutrino.config.module
//         .rule('woff')
//           .include
//             .add(neutrino.options.node_modules);
//     }
//   ]
// };
