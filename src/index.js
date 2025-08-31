import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
import StarRating from "./components/StarRating"


function Test(){
  const [rating, setRating] = React.useState(0);
  return (
    <>
      <StarRating maxRating={10} onRate={setRating} />
      <p>this movie is rated {rating} </p>
    </>
  )
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating maxRating={10} />
    <StarRating size={24} color="#ff0000" />
    <Test />
  </React.StrictMode>
);

