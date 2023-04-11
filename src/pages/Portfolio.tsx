import { useConnectWallet } from "@web3-onboard/react";
import usePortfolio from "../hooks/usePortfolio";

export default function Portfolio () {
    usePortfolio();

    return (
        <div className="">
            Portfolio
        </div>
    )
}