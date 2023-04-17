import { useComptrollerLib } from './contracts/useComptrollerContract';
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { PriceRoute } from './useSwapData';
import { IntegrationManagerAddress, NULL_ADDRESS, UniswapV2AdapterAddress, WBNB } from '../constants/web3';
import useProvider from './useProvider';
import { useCheckNetwork } from './contracts/useCheckNetwork';
import { useVaultLibContract } from './contracts/useVaultLibContract';
import notification from '../helpers/notification';
const abiCoder = new ethers.utils.AbiCoder();

export const useSwap = () => {
  const provider = useProvider();
  const signer = provider?.getSigner();
  const { isWrongNetwork } = useCheckNetwork();
  const [loading, setLoading] = useState(false);
  const { getAccessorAddr } = useVaultLibContract();
  const { getComptrollerLibContract } = useComptrollerLib();

  const swap = useCallback(
    async (fundAddr: string, swapData: PriceRoute) => {
      try {
        if (isWrongNetwork) throw new Error('Wrong Network');
        setLoading(true);

        const accessorAddr = await getAccessorAddr(fundAddr);
        const comptrollerContract = getComptrollerLibContract(accessorAddr);

        if (!comptrollerContract) throw new Error('Not found fund');

        // config route path
        const addresses = [];
        const routerLength = swapData?.protocols?.[0]?.length;
        addresses.push(swapData?.protocols?.[0]?.[0]?.[0].fromTokenAddress);

        for (let i = 0; i < routerLength; i++) {
          const route = swapData?.protocols?.[0]?.[i]?.[0];
          const addr =
            route.toTokenAddress === NULL_ADDRESS ? WBNB : route.toTokenAddress;
          addresses.push(addr);
        }

        const integrationData = abiCoder.encode(
          ['address[]', 'uint256', 'uint256'],
          [addresses, swapData?.fromTokenAmount, '1'],
        );
        const integrationCallArgs = abiCoder.encode(
          ['address', 'bytes4', 'bytes'],
          [
            UniswapV2AdapterAddress,
            '0x03e38a2b', // takeOrder
            integrationData,
          ],
        );

        const receipt = await comptrollerContract.callOnExtension(
          IntegrationManagerAddress,
          0,
          integrationCallArgs,
        );
        await receipt.wait();
        notification.success('Success', 'Successfully executed.');
      } catch (error: any) {
        console.error('swap: ', error);
        const err = error?.reason?.split(':');
        const errorTitle = err ? err[0].toUpperCase() : error.message;
        
        notification.danger(
          errorTitle,
          error?.reason?.slice(errorTitle.length + 1),
        );
      } finally {
        setLoading(false);
      }
    },
    [signer],
  );

  return { loading, swap };
};
