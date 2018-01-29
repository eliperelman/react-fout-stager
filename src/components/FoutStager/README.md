### Demo

```js
require('../../demo.css');

const stages = [{
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
}];

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false,
      startLoading: sessionStorage.foutStagerLoaded,
    };
  }

  render() {
    return (
      <div className="fout-container" style={{ padding: 20 }}>
        <h1>FOFT, or FOUT with Two Stage Render</h1>
        <p>
          This is a paragraph.
          <strong>This is heavier text.</strong>{' '}
          <em>This is emphasized text.</em>{' '}
          <strong><em>This is heavier and emphasized text.</em></strong>
        </p>
        <code>
          {this.state.done ? 'Finished loading fonts. Clear sessionStorage to reset.' : 'Waiting to start loading fonts...'}
        </code>
        <br /><br />
        {this.state.startLoading
          ? (
            <FoutStager
              onStagesLoad={() => this.setState({ done: true })}
              stages={stages}
            />
          )
          : (
            <button onClick={() => this.setState({ startLoading: true })}>
              Start Loading
            </button>
          )}
      </div>
    );
  }
}

<Demo />
```