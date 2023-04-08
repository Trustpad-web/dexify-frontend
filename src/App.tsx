import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import useTopDexfunds from "./hooks/useTopDexfunds";
import './App.css';
import useAllDexfunds from "./hooks/useAllDexfunds";
import AllFunds from "./pages/AllFunds";
import Fund from "./pages/Fund";
import useMonthlyEthPrices from "./hooks/useMonthlyEthPrices";
import useAssets from "./hooks/useAssets";
import useCurrency from "./hooks/useCurrency";

export default function App() {
  useTopDexfunds();
  useAllDexfunds();
  useMonthlyEthPrices();
  useAssets();
  useCurrency("ETH");

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-funds" element={<AllFunds />} />
          <Route path="/fund/:id" element={<Fund />}/>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
