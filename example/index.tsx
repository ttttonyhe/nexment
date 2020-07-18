import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { NexmentContainer } from '../.';

const App = () => {
  const config = {};
  return (
    <div>
      <NexmentContainer config={config} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
