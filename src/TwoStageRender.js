import React from 'react';
import FoutStager from './components/FoutStager';
import './stories.css';

export default class TwoStageRender extends React.Component {
  state = {
    start: !!sessionStorage.foutStagerLoaded,
    done: false
  };

  componentDidMount() {
    if (!this.state.start) {
      setTimeout(() => this.setState({ start: true }), 3000);
    }
  }

  message() {
    if (this.state.done) {
      return 'Finished loading fonts';
    }

    return this.state.start ?
      'Font loading started...' :
      'Waiting to start loading fonts...';
  }

  render() {
    return (
      <div style={{ padding: 20 }}>
        <h1>FOFT, or FOUT with Two Stage Render</h1>
        <p>
          This is a paragraph.
          <strong> This is heavier text.</strong>
          <em> This is emphasized text.</em>
          <strong><em> This is heavier and emphasized text.</em></strong>
        </p>

        <code>{this.message()}</code>

        {this.state.start && (
          <FoutStager
            onStagesLoad={() => this.setState({ done: true })}
            stages={[{
              className: 'fonts-stage-1',
              families: [{ family: 'Lato' }],
              stages: [{
                className: 'fonts-stage-2',
                families: [
                  { family: 'LatoBold', options: { weight: 700 } },
                  { family: 'LatoItalic', options: { style: 'italic' } },
                  { family: 'LatoBoldItalic', options: { weight: 700, style: 'italic' } }
                ]
              }]
            }]} />
        )}
      </div>
    );
  }
}
