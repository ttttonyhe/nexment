import React from 'react';
import './style.scss';

const Thing = () => {
  const [count, setCount] = React.useState<number>(0);
  return (
    <div className="container">
      <p>CountFuck: {count}</p>
      <button
        onClick={() => {
          setCount(init => init + 1);
        }}
      >
        PLUS
      </button>
      <button
        onClick={() => {
          setCount(init => init - 1);
        }}
      >
        MINUS
      </button>
    </div>
  );
};

export default Thing;
