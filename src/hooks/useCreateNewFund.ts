import { useFundDeployerContract } from './contracts/useDeployerContract';
import { ethers } from 'ethers';
import { useCallback, useState } from 'react';
import { useCheckNetwork } from './contracts/useCheckNetwork';
import useProvider from './useProvider';
import notification from '../helpers/notification';

export const useCreateNewFund = () => {
  const provider = useProvider();
  const signer = provider?.getSigner();
  const { isWrongNetwork } = useCheckNetwork();
  const disabled = provider === undefined || isWrongNetwork;
  const fundDeployerContract = useFundDeployerContract();
  const [loading, setLoading] = useState(false);

  const createNewFund = useCallback(
    async (
      fundOwner: string,
      fundName: string,
      denominationAsset: string,
      timeLockInSeconds: number,
      feeManagerConfig: string,
      policyManagerConfigData: string,
    ) => {
      try {
        if (isWrongNetwork) throw new Error('Wrong Network');
        if (!signer) throw new Error('Undefined wallet');
        if (!fundDeployerContract) throw new Error('Undefined Deployer');
        setLoading(true);
        const nonce = await provider?.getTransactionCount(await signer.getAddress(), 'pending');
        const deployFund = await fundDeployerContract.createNewFund(
          fundOwner,
          fundName,
          denominationAsset,
          timeLockInSeconds,
          feeManagerConfig,
          policyManagerConfigData,
          { nonce: nonce },
        );
        const receipt = await deployFund.wait();
        notification.success(
          'Congratulations',
          'A new fund has been created successfully.',
        );
        if (!receipt.events)
          return { newFundAddr: undefined, newComptrollerAddr: undefined };
        const args = receipt.events.filter(
          (e) => e?.['event'] === 'NewFundCreated',
        )[0].args;

        return {
          newFundAddr: args?.[2] as string,
          newComptrollerAddr: args?.[1] as string,
        };
      } catch (error: any) {
        console.error('useCreateNewFund: ', error.code);
        const err = error?.reason?.split(':');
        const errorTitle = err ? err[0].toUpperCase() : error.message;
        notification.danger(
          errorTitle,
          error?.reason?.slice(errorTitle.length + 1),
        );
      } finally {
        setLoading(false);
      }
      return { newFundAddr: undefined, newComptrollerAddr: undefined };
    },
    [signer, fundDeployerContract],
  );

  return { createNewFund, loading, disabled };
};
