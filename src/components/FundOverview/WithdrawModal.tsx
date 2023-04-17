import { useState, useEffect, useCallback } from "react";
import { BigNumber } from "ethers";
import { Button, Spinner } from "flowbite-react";
import CurrencyInput from "../FundManage/FundTrade/CurrencyInput";
import { Token } from "../../@types/token";
import Modal from "react-modal";

const customStyles = {
  overlay: {
    background: "#0000005C",
    zIndex: 20,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "12px",
  },
};

export default function WithdrawModal({
  show,
  onClose,
  onConfirm,
  balance,
  loading,
  disabled,
  shareToken,
  sharePrice
}: {
  show: boolean;
  onClose: () => void;
  onConfirm: (amount: BigNumber) => void;
  balance: BigNumber;
  loading: boolean;
  disabled: boolean;
  shareToken?: Token;
  sharePrice:number;
}) {
  const [amount, setAmount] = useState<BigNumber>(BigNumber.from(0));
  const onAmountChanged = useCallback((_amount: BigNumber) => {
    setAmount(_amount);
  }, []);

  return (
    <Modal
      isOpen={show}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <h3 className="text-title text-[16px] md:text-[20px] mb-5">Redeem Shares</h3>
      <div className="space-y-6 md:min-w-[500px]">
        <CurrencyInput
          tokens={shareToken ? [shareToken] : []}
          amount={amount}
          onAmountChanged={onAmountChanged}
          maxValue={balance}
          onTokenSelected={() => {}}
          selectedToken={shareToken}
          tokenPrice={sharePrice}
        />
      </div>
      <div className="flex ml-auto mt-5 gap-4 w-full">
        {loading ? (
          <Button
            pill={true}
            outline={true}
            className="bg-primary hover:bg-primary ml-auto"
          >
            <Spinner color={"purple"} aria-label="Default status example" />
          </Button>
        ) : (
          <Button
            pill={true}
            outline={true}
            className="bg-primary hover:bg-primary ml-auto"
            onClick={() => onConfirm(amount)}
            disabled={disabled}
          >
            Withdraw
          </Button>
        )}

        <Button
          pill={true}
          className="bg-primary hover:bg-white dark:hover:bg-gray-500 hover:text-primary border-primary hover:border-primary border-2"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
