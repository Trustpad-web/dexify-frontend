import { FundStateDto } from "./fundState";
import { HoldingDto } from "./holding";

export type SharesRedeemedDto = {
    timestamp: string;
    investor?: {
        id: string
    };
    fund?: {
        id: string,
        name: string,
        accessor: ComptrollerDto
    },
    shares: string;
    payoutAssetAmounts: HoldingDto[],
    fundState: FundStateDto;
    transaction: TransactionDto
}