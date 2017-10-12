import React from 'react';
import { render } from 'react-dom';
import { Stories, Story, Props } from 'neutrino-preset-react-components/lib';
import TwoStageRender from './TwoStageRender';

const root = document.getElementById('root');

render((
  <Stories>
    <Story component={TwoStageRender}>
      <Props name="Default" />
    </Story>
  </Stories>
), root);