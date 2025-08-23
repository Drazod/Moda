import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "./layouts/welcomePage";
import Home from "./layouts/homePage";
import Store from "./layouts/storePage";
import Product from "./layouts/productPage";
import CartModal from "./layouts/cart";
import ProfilePage from "./layouts/profilePage";

// dash's import
import DashLayout from "./layouts/dash/dashLayout";
import DashBoard_Main from "./layouts/dash/dashBoard";
import DashOM_Main from "./layouts/dash/dashOM.jsx"; 
import DashActLog_Main from "./layouts/dash/dashActLog.jsx";
import DashUM_Main from "./layouts/dash/dashUM.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/store" element={<Store/>}/>
        <Route path="/product" element={<Product/>}/>
        <Route path="/cart" element={<CartModal/>}/>
        <Route path="/profile" element={<ProfilePage />} />
        {/* dash's Route */}
        <Route path="/dash-board" element={<DashLayout />}>
          <Route index element={<DashBoard_Main />} />
          {/* Other routes for dash's properties*/}
          <Route path="order-manage" element={<DashOM_Main />} />
          <Route path="activity-log" element={<DashActLog_Main />} />
          <Route path="users-manage" element={<DashUM_Main />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
