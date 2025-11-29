import OtpVerificationPage from "./layouts/OtpVerificationPage";
import { Toaster } from "react-hot-toast";
import React from "react";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "./layouts/welcomePage";
import Home from "./layouts/homePage";
import Store from "./layouts/storePage";
import FittingRoom from "./layouts/fittingRoom.jsx";
import Product from "./layouts/productPage";
import CartModal from "./layouts/cart";
import ProfilePage from "./layouts/profilePage";
import LogInPage from "./layouts/loginPage";
import Register from "./layouts/registerPage";
import Setting from "./layouts/settingPage";
import Transactions from "./layouts/transactionHistoryPage";
import ResetPasswordPage from "./layouts/ResetPasswordPage_new";
import FriendsPage from "./layouts/friendsPage";
import ChatPage from "./layouts/chatPage";
 
// import Settings from "./layouts/settingPage";
// dash's import
import DashLayout from "./layouts/dash/dashLayout";
import DashBoard_Main from "./layouts/dash/dashBoard";
import DashOM_Main from "./layouts/dash/dashOM.jsx"; 
import DashRfM_Main from "./layouts/dash/dashRfM.jsx";
import DashActLog_Main from "./layouts/dash/dashActLog.jsx";
import DashUM_Main from "./layouts/dash/dashUM.jsx";
import DashPdM_Main from "./layouts/dash/dashPdM.jsx";
import DashUptN_Main from "./layouts/dash/dashUptN.jsx";
import DashBrM_Main from "./layouts/dash/dashBrM.jsx";
import RequireAdmin from "./utils/RequireAdmin.jsx";
import RequireAuth from "./utils/RequireAuth";
import PublicOnly from "./utils/PublicOnly";
import usePresenceHeartbeat from '../src/hooks/usePresenceHeartbeat';
import AdminProfile from './layouts/dash/adminProfile.jsx';
import AdminSettings from './layouts/dash/adminSettings.jsx';
import CreateAdminAccount from './layouts/dash/createAdminAccount.jsx';
import PaymentFail from "./layouts/paymentfail.jsx";
import PaymentSuccess from "./layouts/paymentsuccess.jsx";
const App = () => {
  usePresenceHeartbeat(20000);
  return (

  <CartProvider>
  <Routes>
        <Route path="/" element={<Welcome/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/store" element={<Store/>}/>
        <Route path="/product" element={<Product/>}/>
        <Route path="/fitting-room" element={<FittingRoom/>}/>
        <Route path="/cart" element={<CartModal/>}/>
        <Route path="/payment-success" element={<PaymentSuccess/>}/>
        {/* <Route path="/payment-fail" element={<PaymentFail/>}/> */}
        <Route path="/payment-failed" element={<PaymentFail/>}/>
        <Route path="/login" element={
          <PublicOnly>
            <LogInPage />
          </PublicOnly>
        } />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/register" element={
          <PublicOnly>
            <Register />
          </PublicOnly>
        } />
        <Route path="/profile" element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        } />
        <Route path="/setting" element={
          <RequireAuth>
            <Setting />
          </RequireAuth>
        } />
        <Route path="/transactions" element={
          <RequireAuth>
            <Transactions />
          </RequireAuth>
        } />
        <Route path="/friends" element={
          <RequireAuth>
            <FriendsPage />
          </RequireAuth>
        } />
        <Route path="/chat" element={
          <RequireAuth>
            <ChatPage />
          </RequireAuth>
        } />
        {/* dash's Route */}
        <Route path="/dash-board" element={
          <RequireAdmin>
            <DashLayout />

          </RequireAdmin>
        }>
          <Route index element={<DashBoard_Main />} />
          {/* Other routes for dash's properties*/}
          <Route path="order-manage" element={<DashOM_Main />} />
          <Route path="refund-manage" element={<DashRfM_Main />} />
          <Route path="activity-log" element={<DashActLog_Main />} />
          <Route path="users-manage" element={<DashUM_Main />} />
          <Route path="products-manage" element={<DashPdM_Main />} />
          <Route path="branch-manage" element={<DashBrM_Main />} />
          <Route path="update-notices" element={<DashUptN_Main />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="create-admin" element={<CreateAdminAccount />} />
          {/* Admin pages */}

        </Route>
  </Routes>
  {/* Toasts */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontSize: 14, zIndex: 999999 },
            duration: 2500,
          }}
        />
  </CartProvider>
  );
};

export default App;
