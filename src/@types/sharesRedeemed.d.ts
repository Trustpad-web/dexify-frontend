import { FundStateDto } from "./fundState";
import { HoldingDto } from "./holding";

export type SharesRedeemedDto = {
    timestamp: string;
    investor: {
        id: string
    };
    shares: string;
    payoutAssetAmounts: HoldingDto[],
    fundState: FundStateDto;
    transaction: TransactionDto
}