import { FundStateDto } from "./fundState";
import { TransactionDto } from "./transaction";

export type SharesBoughtDto = {
    timestamp: string;
    investor: {
        id: string
    };
    investmentAmount: string;
    shares: string;
    fundState: FundStateDto
    transaction: TransactionDto
}