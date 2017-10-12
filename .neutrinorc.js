module.exports = {
  use: [
    'neutrino-preset-react-components',
    (neutrino) => {
      neutrino.config.externals(['react', 'react-dom', 'prop-types', 'fontfaceobserver']);
    }
  ]
};
