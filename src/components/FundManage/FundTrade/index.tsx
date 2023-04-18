import { useCallback, useEffect, useState } from "react";
import { FundOverviewWithHistoryResponse } from "../../../@types";
import tokenlists from "../../../constants/tokenlists.json";
import { Token } from "../../../@types/token";
import { formatCurrency, getTokenInfo } from "../../../helpers";
import CurrencyInput from "./CurrencyInput";
import { useSwapData } from "../../../hooks/useSwapData";
import { formatUnits } from "ethers/lib/utils";
import { useAppSelector } from "../../../store";
import { Button, Spinner } from "flowbite-react";
import { useSwap } from "../../../hooks/useSwap";
import useERC20 from "../../../hooks/useERC20";
import { BigNumber } from "ethers";

export default function FundTrade({
  fundDetail,
}: {
  fundDetail: FundOverviewWithHistoryResponse | undefined;
}) {
  const [srcTokens, setSrcTokens] = useState<Token[]>([]);
  const [srcToken, setSrcToken] = useState<Token>();
  const [destToken, setDestToken] = useState<Token>();
  const [srcTokenSwapAmount, setSrcTokenSwapAmount] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const ethPrice = useAppSelector((state) => state.currency.data.price?.price);
  const swapData = useSwapData(srcToken, destToken, srcTokenSwapAmount);
  const { loading: swapLoading, swap } = useSwap();

  const { getBalance } = useERC20(srcToken?.address || "0x");
  const [srcTokenMaxBalance, setSrcTokenMaxBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );

  useEffect(() => {
    (async function () {
      const _srcTokenMaxBalance = await getBalance(fundDetail?.id || "0x");
      setSrcTokenMaxBalance(_srcTokenMaxBalance);
    })();
  }, [srcToken, getBalance, fundDetail?.id]);

  const onSrcTokenChanged = useCallback(
    (token: Token | undefined) => {
      if (token?.address?.toLowerCase() === destToken?.address?.toLowerCase()) {
        setDestToken(undefined);
      } else {
        setSrcToken(token);
      }
    },
    [srcTokens, destToken?.address]
  );

  const onDestTokenChanged = useCallback(
    (token: Token | undefined) => {
      const asset = srcTokens.find(
        (item) => item.address.toLowerCase() === token?.address?.toLowerCase()
      );
      if (asset) {
        setDestToken(asset);
      } else {
        setDestToken(token);
      }
    },
    [srcTokens]
  );

  const onSrcTokenAmountChanged = useCallback((amount: BigNumber) => {
    setSrcTokenSwapAmount(amount);
  }, []);

  const onDestTokenAmountChanged = useCallback((amount: BigNumber) => {
    // setDestTokenAmount(amount);
  }, []);

  useEffect(() => {
    const _tokenes: Token[] =
      fundDetail?.assets?.map((asset) => {
        return {
          address: asset.id,
          name: asset.name,
          decimals: Number(asset.decimals),
          logoURI: getTokenInfo(asset.id)?.logoURI || "",
          symbol: asset.symbol,
          amount: asset.amount,
        };
      }) || [];

    setSrcTokens(_tokenes);
    setSrcToken(_tokenes?.[0]);
  }, [fundDetail?.assets]);

  const onSwap = () => {
    if (fundDetail && swapData) {
      swap(fundDetail?.id, swapData);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-[800px] w-full relative flex flex-col space-y-5">
        <div className="w-full flex flex-col space-y-2">
          <label
            htmlFor=""
            className="text-description text-[14px] md:text-[16px]"
          >
            Sell
          </label>
          <CurrencyInput
            tokens={srcTokens}
            amount={srcTokenSwapAmount}
            selectedToken={srcToken}
            onTokenSelected={onSrcTokenChanged}
            onAmountChanged={onSrcTokenAmountChanged}
            maxValue={srcTokenMaxBalance}
          />
        </div>
        <div className="w-full flex flex-col space-y-2">
          <label
            htmlFor=""
            className="text-description text-[14px] md:text-[16px]"
          >
            For
          </label>
          <CurrencyInput
            tokens={tokenlists.filter(
              (item) =>
                item.address.toLowerCase() !== srcToken?.address?.toLowerCase()
            )}
            amount={BigNumber.from(swapData?.toTokenAmount || 0)}
            selectedToken={destToken}
            onTokenSelected={onDestTokenChanged}
            readOnly={true}
            onAmountChanged={onDestTokenAmountChanged}
          />
        </div>

        {swapData && (
          <>
            <div className="mt-6 my-20 flex flex-col gap-2 bg-primary_light p-4 rounded-[12px]">
              <div className="flex justify-between items-center">
                <span className="col-span-1 text-center text-sm">Rate</span>
                <div className="relative">
                  <span className="col-span-2 text-primary font-bold">
                    {"1 " + destToken?.symbol + " = "}
                    {new Intl.NumberFormat().format(
                      parseFloat(
                        formatUnits(
                          swapData?.fromTokenAmount,
                          swapData?.fromToken.decimals
                        )
                      ) /
                        parseFloat(
                          formatUnits(
                            swapData?.toTokenAmount,
                            swapData?.toToken.decimals
                          )
                        )
                    )}{" "}
                    {srcToken?.symbol}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="col-span-1 text-center text-sm">Fee</span>
                <div className="relative col-span-2">
                  <span className="w-full text-primary font-bold">
                    {formatCurrency(
                      Number(swapData?.estimatedGas) *
                        0.000000005 *
                        Number(ethPrice)
                    )}
                  </span>
                </div>
              </div>
            </div>
            {swapLoading ? (
              <Button
                color={"white"}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:bg-gradient-to-l text-white mx-auto mt-10 px-5"
              >
                <Spinner color={"purple"} aria-label="Default status example" />
              </Button>
            ) : (
              <Button
                color={"white"}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:bg-gradient-to-l text-white mx-auto mt-10 px-5"
                onClick={onSwap}
              >
                Swap
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
