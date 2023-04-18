import { resolveArguments } from '@enzymefinance/ethers';
import { BigNumber } from '@ethersproject/bignumber';
import { parseEther, parseUnits } from '@ethersproject/units';
import { utils } from 'ethers';
import { entranceRateDirectFee, performanceFee as performanceFeeJSON, minMaxInvestment } from '../web3/abi';

export const prepareFundData = (
  entryFee: number,
  performanceFee: number,
  minimumInvestment: number,
  maximumInvestment: number,
  decimals?: number
) => {
  const feeManagerSettingsData = []; // value configurations
  const fees = []; // list of address

  if (entryFee) {
    fees.push(entranceRateDirectFee.address);
    feeManagerSettingsData.push(getEntranceRateFeeConfigArgs(entryFee));
  }

  fees.push(performanceFeeJSON.address);
  feeManagerSettingsData.push(getPerformanceFees(performanceFee));

  /// PREPARE FEE CONFIGURATIONS DATA
  const feeArgsData = getFeesManagerConfigArgsData(
    fees,
    feeManagerSettingsData,
  );

  const policyManagerSettingsData = [];
  const policies = [];

  // Push settings and actual policy
  policies.push(minMaxInvestment.address);
  policyManagerSettingsData.push(
    getMinMaxDepositPolicyArgs(
      parseUnits(minimumInvestment.toString(), decimals),
      parseUnits(maximumInvestment.toString(), decimals),
    ),
  );
  const policyArgsData = getPolicyArgsData(policies, policyManagerSettingsData);

  return {
    feeArgsData,
    policyArgsData,
  };
};

/**
 * Rate is  number representing a 1%
 */
function getEntranceRateFeeConfigArgs(rateFee: number) {
  // The rate must be (rate/100 * 10**18) or directly rate * 10**16;
  const rate = parseEther((rateFee / 100).toString());
  return encodeArgs(['uint256'], [rate]);
}

function encodeArgs(types: Array<string>, args: Array<any>) {
  const params = types.map((type) => utils.ParamType.from(type));
  const resolved = resolveArguments(params, args); // byteLike value
  const hex = utils.defaultAbiCoder.encode(params, resolved);
  return utils.hexlify(utils.arrayify(hex));
}

/**
 *
 * @param {*} rate Rate in percentage
 * @param {*} period Period at which it will be applied
 */
const getPerformanceFees = (rateFee: number) => {
  // The period will default to 30 days
  const defaultPeriod = 2592000;

  // The rate must be (rate/100 * 10**18) or directly rate * 10**16;
  const rate = parseEther((rateFee / 100).toString());
  return performanceFeeConfigArgs(rate, defaultPeriod);
};

function performanceFeeConfigArgs(rate: BigNumber, period: number) {
  return encodeArgs(['uint256', 'uint256'], [rate, period]);
}

const getFeesManagerConfigArgsData = (
  fees: Array<string>,
  feeManagerSettingsData: Array<string>,
) => {
  // Convert Fees
  return feeManagerConfigArgs({
    fees: fees,
    settings: feeManagerSettingsData,
  });
};

function feeManagerConfigArgs({
  fees,
  settings,
}: {
  fees: Array<string>;
  settings: Array<string>;
}) {
  return encodeArgs(['address[]', 'bytes[]'], [fees, settings]);
}

const getMinMaxDepositPolicyArgs = (
  minDeposit: BigNumber,
  maxDeposit: BigNumber,
) => {
  return encodeArgs(['uint256', 'uint256'], [minDeposit, maxDeposit]);
};

const getPolicyArgsData = (
  policies: Array<string>,
  policySettings: Array<string>,
) => {
  return encodeArgs(['address[]', 'bytes[]'], [policies, policySettings]);
};
