import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "./layouts/welcomePage";
import Home from "./layouts/homePage";
import Store from "./layouts/storePage";
import Product from "./layouts/productPage";
import CartModal from "./layouts/cart";

// Dashboard's layout
import DashboardLayout from "./layouts/dash/dashLayout";
import DashBoardMain from "./layouts/dash/dashBoard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/store" element={<Store/>}/>
        <Route path="/product" element={<Product/>}/>
        <Route path="/cart" element={<CartModal/>}/>

        {/* Dashboard's Route */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashBoardMain />} />
          {/* Other routes for dashboard properties*/}
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
