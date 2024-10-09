import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';

import StarRating from "./StarRating";

function Test() {

const [MovieRating, setMovieRating] = useState(0)

  return <div>
    <StarRating maxRating={10} color="blue" onMovieRating={setMovieRating}></StarRating>.
    <p>This Movie Is Rated {MovieRating} Stars</p>
  </div>
}





const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={5} Messages={["Terrible","Bad","Okay","Good","Amazing"]}></StarRating>
    <StarRating color="red" size={24} className="test" defaultRate={2} ></StarRating>
    <Test></Test> */}
  </React.StrictMode>
);
