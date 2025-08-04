import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "./layouts/welcomePage";
import Home from "./layouts/homePage";
import Store from "./layouts/storePage";
import Product from "./layouts/productPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/store" element={<Store/>}/>
        <Route path="/product" element={<Product/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
