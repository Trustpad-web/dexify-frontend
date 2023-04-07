import { Web3OnboardProvider, init } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import infinityWalletModule from "@web3-onboard/infinity-wallet";
import gnosisModule from "@web3-onboard/gnosis";
import keepkeyModule from "@web3-onboard/keepkey";
import keystoneModule from "@web3-onboard/keystone";
import ledgerModule from "@web3-onboard/ledger";
import walletConnectModule from "@web3-onboard/walletconnect";
import coinbaseModule from "@web3-onboard/coinbase";
import dcentModule from "@web3-onboard/dcent";
import sequenceModule from "@web3-onboard/sequence";
import trustModule from "@web3-onboard/trust";
import frontierModule from "@web3-onboard/frontier";
import { chains } from "./chains";

import logo from '../assets/imgs/logo.svg';

const wInjected = injectedModule();
const wCoinbase = coinbaseModule();
const wDcent = dcentModule();
const wWalletConnect = walletConnectModule();
const wInfinityWallet = infinityWalletModule();
const wLedger = ledgerModule();
const wKeystone = keystoneModule();
const wKeepkey = keepkeyModule();
const wGnosis = gnosisModule();
const wSequence = sequenceModule();
const wTrust = trustModule();
const wFrontier = frontierModule();

const wallets = [
  wInjected,
  wCoinbase,
  wWalletConnect,
  wInfinityWallet,
  wKeepkey,
  wSequence,
  wTrust,
  wFrontier,
  wLedger,
  wDcent,
  wGnosis,
  wKeystone,
];

const appMetadata = {
  name: "Connect Wallet",
  icon: logo,
  description: "Connect Wallet Modal",
  recommendedInjectedWallets: [
    { name: "MetaMask", url: "https://metamask.io" },
    { name: "Coinbase", url: "https://wallet.coinbase.com/" },
  ],
  gettingStartedGuide: "https://blocknative.com",
  explore: "https://blocknative.com",
};

const web3Onboard = init({
  wallets,
  chains,
  appMetadata,
  connect: { autoConnectLastWallet: true },
  accountCenter: { desktop: { enabled: false }, mobile: { enabled: false } }
});
function Web3Context({ children }: { children: React.ReactNode }) {
  return (
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      {children}
    </Web3OnboardProvider>
  );
}
export default Web3Context;
