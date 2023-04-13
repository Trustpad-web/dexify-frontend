import { FundDto } from "./fund";
import { FundStateDto } from "./fundState";
import { TransactionDto } from "./transaction";

export type InvestmentSharesChangeDto = {
    timestamp: string;
    fund: FundDto;
    shares: string;
    type: string;
    fundState: FundStateDto,
    transaction: TransactionDto,
}