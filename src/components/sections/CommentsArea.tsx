import React from 'react';

const CommentsArea = () => {
  const sendComment = () => {};
  const handleNameChange = (res: any) => {
    console.log(res);
  };
  return (
    <div>
      <input placeholder="name" onChange={handleNameChange}></input>
      <input placeholder="email"></input>
      <textarea placeholder="Enter some text"></textarea>
      <button onClick={() => sendComment}>Send</button>
    </div>
  );
};

export default CommentsArea;
