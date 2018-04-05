/* eslint-disable import/no-extraneous-dependencies */
import { Component } from 'react';
import { arrayOf, func, node, object, shape, string } from 'prop-types';
import FontFaceObserver from 'fontfaceobserver';

const html = document.documentElement;
const base = {
  className: string.isRequired,
  families: arrayOf(
    shape({
      family: string.isRequired,
      options: object,
    })
  ).isRequired,
};
const stage = shape({ ...base, stages: arrayOf(shape(base)) });
const loadStage = async function loadStage({ className, families, stages }) {
  await Promise.all(
    families.map(({ family, options }) =>
      new FontFaceObserver(family, options).load()
    )
  );
  html.classList.add(className);

  if (stages && stages.length) {
    return Promise.all(stages.map(loadStage));
  }
};

const classStage = function classStage({ className, stages }) {
  html.classList.add(className);

  if (stages && stages.length) {
    stages.forEach(classStage);
  }
};

/**
 * Progressively render typefaces using CSS class stages
 */
export default class FoutStager extends Component {
  static propTypes = {
    stages: arrayOf(stage).isRequired,
    sessionKey: string,
    onStagesLoad: func,
    children: node,
  };

  static defaultProps = {
    sessionKey: 'foutStagerLoaded',
    onStagesLoad: null,
    children: null,
  };

  state = {
    loaded: false,
  };

  async componentDidMount() {
    const { sessionKey, stages, onStagesLoad } = this.props;

    if (sessionStorage[sessionKey]) {
      stages.forEach(classStage);
    } else {
      await Promise.all(stages.map(loadStage));
      sessionStorage[sessionKey] = true;
    }

    // This has been disabled in Airbnb but hasn't been published yet
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ loaded: true });

    if (onStagesLoad) {
      onStagesLoad();
    }
  }

  render() {
    return this.props.children && this.state.loaded
      ? this.props.children
      : null;
  }
}
