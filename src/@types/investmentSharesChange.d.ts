import { FundDto } from "./fund";
import { FundStateDto } from "./fundState";

export type InvestmentSharesChangeDto = {
    timestamp: string;
    fund: FundDto;
    shares: string;
    type: string;
    fundState: FundStateDto
}