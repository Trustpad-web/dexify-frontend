import TokenSelector from "../../TokenSelector";
import { formatCurrency, formatNumber } from "../../../helpers";
import { Token } from "../../../@types/token";
import { useAppSelector } from "../../../store";
import { getAsset } from "../../../store/slices/assets.slice";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";

export default function CurrencyInput({
  tokens,
  selectedToken,
  onTokenSelected,
  onAmountChanged,
  amount,
  readOnly,
  maxValue,
  tokenPrice,
}: {
  tokens: Token[];
  selectedToken?: Token;
  amount: BigNumber;
  onTokenSelected: (token: Token | undefined) => void;
  onAmountChanged: (amount: BigNumber) => void;
  readOnly?: boolean;
  maxValue?: BigNumber;
  tokenPrice?: number;
}) {
  const asset = useAppSelector((state) =>
    getAsset(state, selectedToken?.address || "0x")
  );

  const ethPrice = useAppSelector((state) => state.currency.data.price?.price);

  const warning = maxValue?.gt(0) && amount.gt(maxValue);

  const handleMaxClick = () => {
    if (maxValue && maxValue.gt(0)) {
      onAmountChanged(maxValue);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="relative flex flex-col  mt-0 rounded-[12px] border-2 pt-[8px] pb-[20px] h-[80px] px-2">
        <input
          type="number"
          className={
            "block w-full outline-none border-none pt-[8px] pl-[3px] pr-[120px] text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[14px] sm:leading-6 md:text-[16px]" +
            (warning ? " !text-danger !border-danger" : "")
          }
          placeholder="0.00"
          style={{ boxShadow: "none" }}
          value={Number(
            amount.gt(0) ? formatUnits(amount, selectedToken?.decimals) : 0
          )}
          readOnly={readOnly}
          onChange={(e) =>
            onAmountChanged(
              parseUnits(
                e.target?.value?.toString() || "0",
                selectedToken?.decimals
              )
            )
          }
        />
        <div className="absolute inset-y-0 top-[8px] right-[3px] px-2 py-1 flex items-center rounded-[30px] border-2 bg-slate-200 hover:bg-slate-300 text-slate-900 h-fit">
          <label htmlFor="currency" className="sr-only">
            Currency
          </label>
          <TokenSelector
            data={tokens}
            onSelectToken={onTokenSelected}
            selectedToken={selectedToken}
          />
        </div>
        <div className="absolute bottom-2 w-full left-0 px-[15px] flex justify-between text-[10px] md:text-[12px]">
          <span className="text-description">
            {tokenPrice
              ? formatCurrency(
                  Number(formatUnits(amount, selectedToken?.decimals)) *
                    tokenPrice
                )
              : formatCurrency(
                  Number(formatUnits(amount, selectedToken?.decimals)) *
                    Number(asset?.price?.price) *
                    Number(ethPrice)
                )}
          </span>
          <span
            className="text-primary cursor-pointer "
            onClick={handleMaxClick}
          >
            Balance: {formatNumber(selectedToken?.amount || 0, 6)}
          </span>
        </div>
      </div>
      {warning && (
        <span className="ml-auto text-sm text-danger">Exeeds balance</span>
      )}
    </div>
  );
}
