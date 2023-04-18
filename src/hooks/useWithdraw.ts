import { BigNumber } from 'ethers';
import { useCallback, useState } from 'react';
import { useCheckNetwork } from './contracts/useCheckNetwork';
import { useComptrollerLib } from './contracts/useComptrollerContract';
import { useVaultLibContract } from './contracts/useVaultLibContract';
import { parseEther } from '@ethersproject/units';
import useProvider from './useProvider';
import notification from '../helpers/notification';

export const useWithdraw = (fundAddr: string) => {
  const provider = useProvider();
  const signer = provider?.getSigner();
  const { isWrongNetwork } = useCheckNetwork();
  const disabled = provider === undefined || isWrongNetwork;

  const [loading, setLoading] = useState(false);

  const { getAccessorAddr } = useVaultLibContract();
  const { getComptrollerLibContract } = useComptrollerLib();

  const redeemSharesDetailed = useCallback(
    async (amount: BigNumber) => {
      try {
        if (isWrongNetwork) throw new Error('Wrong Network');
        if (amount.eq(0)) throw new Error('Amount should be greater than 0');
        setLoading(true);

        const accessorAddr = await getAccessorAddr(fundAddr);

        const comptrollerLabContract = getComptrollerLibContract(accessorAddr);
        if (!comptrollerLabContract) throw new Error('Not found Fund');
        const redeemSharesDetailedTx =
          await comptrollerLabContract?.redeemSharesDetailed(
            typeof amount === 'number' ? parseEther(String(amount)) : amount,
            [],
            [],
          );
        await redeemSharesDetailedTx.wait();
        notification.success(
          'Success',
          'Your shares have been withdrawn',
        );
      } catch (error: any) {
        console.error('redeemSharesDetailed: ', error);
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
    [signer, getComptrollerLibContract, getAccessorAddr],
  );

  return { redeemSharesDetailed, loading, disabled };
};
