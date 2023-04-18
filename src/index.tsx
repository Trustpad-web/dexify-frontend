import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Web3Context from "./web3/web3Context";
import { store } from "./store";
import { Provider } from "react-redux";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { SUBGRAPH_SERVER } from "./constants";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const client = new ApolloClient({
  uri: SUBGRAPH_SERVER,
  cache: new InMemoryCache(),
});

root.render(
  <React.StrictMode>
    <Web3Context>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <ReactNotifications />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    </Web3Context>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
