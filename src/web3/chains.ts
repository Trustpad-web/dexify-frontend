export interface Chain {
  namespace?: "evm";
  id: string;
  rpcUrl: string;
  label: string;
  token: string;
}

export const chains: Chain[] = [
  {
    id: "0x38",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    label: "Binance Smart Chain",
    token: "BNB",
  },
];
