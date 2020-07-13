/**
 * Nexment Container
 * main entry
 */

import React from "react";
import "../../assets/styles/index.scss";

const Container = () => {
  return (
    <div className="container">
      <h1>Hello World</h1>
      <button onClick={deleteData}>Delete</button>
      <button onClick={saveData}>Save</button>
    </div>
  );
};

const deleteData = () => {
  console.log('nb')
};

const saveData = () => {
  console.log('nb')
};

export default Container;

