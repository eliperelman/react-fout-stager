import React from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';
import FontFaceObserver from 'fontfaceobserver';

const html = document.documentElement;
const base = {
  className: string.isRequired,
  families: arrayOf(shape({
    family: string.isRequired,
    options: object
  })).isRequired
};
const stage = shape({ ...base, stages: arrayOf(shape(base)) });
/* eslint-disable no-shadow, consistent-return */
const loadStage = async function loadStage({ className, families, stages }) {
  await Promise.all(families.map(({ family, options }) => new FontFaceObserver(family, options).load()));
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
/* eslint-enable no-shadow, consistent-return */

export default class FoutLoader extends React.PureComponent {
  static propTypes = {
    stages: arrayOf(stage).isRequired,
    sessionKey: string,
    onStagesLoad: func
  };

  static defaultProps = {
    sessionKey: 'foutStagerLoaded'
  };

  state = {
    loaded: false
  };

  async componentWillMount() {
    if (sessionStorage[this.props.sessionKey]) {
      this.props.stages.forEach(classStage);
    } else {
      await Promise.all(this.props.stages.map(loadStage));
      sessionStorage[this.props.sessionKey] = true;
    }

    this.setState({ loaded: true });

    if (this.props.onStagesLoad) {
      this.props.onStagesLoad();
    }
  }

  render() {
    if (this.props.children && this.state.loaded) {
      return this.props.children;
    }
  }
}
