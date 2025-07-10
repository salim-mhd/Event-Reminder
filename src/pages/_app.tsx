import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { store } from "../store/store"; // adjust the path as needed
import { useEffect } from "react";
import { initSocket } from "@/socket/socket";

const App = ({ Component, pageProps }: AppProps) => {

  
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App
