import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import { ThemeProvider } from "@material-tailwind/react";
import App from "./App";
import { Provider } from "react-redux";
// import { store } from "./configs/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* // <ThemeProvider> */}
      {/* <Provider store={store}> */}
          <App/>
      {/* </Provider> */}
    {/* // </ThemeProvider> */}
  </React.StrictMode>
);

