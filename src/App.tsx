import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Layout from "./layouts/Layout";
import useTopDexfunds from "./hooks/useTopDexfunds";
import "./App.css";
import useAllDexfunds from "./hooks/useAllDexfunds";
import useMonthlyEthPrices from "./hooks/useMonthlyEthPrices";
import useAssets from "./hooks/useAssets";
import useCurrency from "./hooks/useCurrency";
import { useConnectWallet } from "@web3-onboard/react";
import LoadingScreen from "./layouts/LoadingScreen";
import { useAppDispatch } from "./store";
import { updateMyAccountWithTwitter } from "./store/slices/accountSlice";
import useProvider from "./hooks/useProvider";

const Home = lazy(async () => import("./pages/Home")); // Lazy-loaded
const Portfolio = lazy(async () => import("./pages/Portfolio"));
const Manage = lazy(async () => import("./pages/Manage"));
const CreateVault = lazy(async () => import("./pages/CreateVault"));
const AllFunds = lazy(async () => import("./pages/AllFunds"));
const Fund = lazy(async () => import("./pages/Fund"));
const Profile = lazy(async () => import('./pages/Profile'));

export default function App() {
  useTopDexfunds();
  useAllDexfunds();
  useMonthlyEthPrices();
  useAssets();
  useCurrency("ETH");

  const dispatch = useAppDispatch();

  const [{ wallet }] = useConnectWallet();
  const provider = useProvider();
  const navigate = useNavigate();

  const location = useLocation()
  const oauth_token = new URLSearchParams(location.search).get('oauth_token');
  const oauth_verifier = new URLSearchParams(location.search).get(
    'oauth_verifier',
  );

  useEffect(() => {
    verifyTwitter();
    async function verifyTwitter() {
      
      const account = wallet?.accounts?.[0]?.address;
      if (oauth_token && oauth_verifier && account && provider) {
        await dispatch(
          updateMyAccountWithTwitter({
            signer: provider?.getSigner(account),
            oauth_verifier,
          }),
        );
        const twitterLocation = localStorage.getItem('twitter_login_location');
        navigate(`/${twitterLocation}`);
      }
    }
  }, [oauth_token, oauth_verifier, wallet, provider, dispatch, navigate]);

  return (
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            {
              // protected routes
              wallet?.accounts?.[0].address && (
                <>
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/manage" element={<Manage />} />
                  <Route path="/create-vault" element={<CreateVault />} />
                  <Route path="/account" element={<Profile />} />
                </>
              )
            }
            <Route path="/all-funds" element={<AllFunds />} />
            <Route path="/index-funds" element={<AllFunds />} />
            <Route path="/institution-funds" element={<AllFunds />} />
            <Route path="/icon-funds" element={<AllFunds />} />
            <Route path="/fund/:id" element={<Fund />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
  );
}
