import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import useTopDexfunds from "./hooks/useTopDexfunds";
import "./App.css";
import useAllDexfunds from "./hooks/useAllDexfunds";
import AllFunds from "./pages/AllFunds";
import Fund from "./pages/Fund";
import useMonthlyEthPrices from "./hooks/useMonthlyEthPrices";
import useAssets from "./hooks/useAssets";
import useCurrency from "./hooks/useCurrency";
import Portfolio from "./pages/Portfolio";
import { useConnectWallet } from "@web3-onboard/react";
import Manage from "./pages/Manage";

export default function App() {
  useTopDexfunds();
  useAllDexfunds();
  useMonthlyEthPrices();
  useAssets();
  useCurrency("ETH");

  const [{ wallet }] = useConnectWallet();
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {
            // protected routes
            wallet?.accounts?.[0].address && (
              <>
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/manage" element={<Manage />} />
              </>
            )
          }
          <Route path="/all-funds" element={<AllFunds />} />
          <Route path="/fund/:id" element={<Fund />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
