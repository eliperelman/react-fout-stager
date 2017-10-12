module.exports = {
  use: [
    'neutrino-preset-react-components',
    (neutrino) => {
      if (process.env.NODE_ENV === 'production') {
        neutrino.config.externals(['react', 'react-dom', 'prop-types', 'fontfaceobserver']);
      }

      neutrino.config.module
        .rule('woff')
          .include
            .add(neutrino.options.node_modules);

      neutrino.config.module
        .rule('style')
          .use('css')
            .options({ modules: false });
    }
  ]
};
