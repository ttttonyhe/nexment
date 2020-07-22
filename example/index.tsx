import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { NexmentContainer } from '../.';

const App = () => {
  const config = {
    leancloud: {
      appId: '6Kcb9HB1iOR87HUbAvnMyUER-gzGzoHsz',
      appKey: 'zf3gAf9CGIHLL8Crctb0sJLV',
      serverURL: 'https://leancloud.ouorz.com',
    },
    admin: {
      name: 'TonyHe',
      email: 'he@holptech.com',
      pwd: '12345678',
    },
  };
  return (
    <div className="example-container">
      <NexmentContainer config={config} />
      <style>
        {`
        .example-container{
          width:750px;
          margin:0 auto;
        }`}
      </style>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
