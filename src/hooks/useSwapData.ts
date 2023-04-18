import { useState, useEffect } from 'react';
import axios from 'axios';
import { BigNumber } from 'ethers';
import { Token } from '../@types/token';

export type PriceRoute = {
  fromToken: Token;
  toToken: Token;
  toTokenAmount: string | number;
  fromTokenAmount: string | number;
  protocols: {
    name: string;
    part: number;
    fromTokenAddress: string;
    toTokenAddress: string;
  }[][][];
  estimatedGas: number;
};

export const getPriceRoute = async (from: Token | undefined, to: Token | undefined, amount: BigNumber) => {
  try {
    const getPathRequestEndpoint = `https://api.1inch.io/v5.0/56/quote?fromTokenAddress=${
      from?.address || '0x'
    }&toTokenAddress=${
      to?.address || '0x'
    }&amount=${amount.toString()}&protocols=PANCAKESWAP_V2`;
    const { data } = await axios.get(getPathRequestEndpoint);
    return data as PriceRoute;
  } catch (error: any) {
    if (!error.response.data.value)
    throw error;
  }
};

export const useSwapData = (from: Token | undefined, to: Token | undefined, amount: BigNumber) => {
  const [swapData, setSwapData] = useState<PriceRoute>();

  useEffect(() => {
    if (to && from && amount?.gt(BigNumber.from(0))) {
      getPriceRouteData();
    } else {
      setSwapData(undefined);
    }

    async function getPriceRouteData() {
      const _swapData = await getPriceRoute(from, to, amount);
      setSwapData(_swapData);
    }
  }, [from, to, amount]);

  return swapData;
};
