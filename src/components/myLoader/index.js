import React from 'react';
import ClipLoader from "react-spinners/ClipLoader";


const MyLoader = () => (
    
    <ClipLoader
   
    size={150}
    aria-label="Loading Spinner"
    data-testid="loader"
  />
);

export default MyLoader;
