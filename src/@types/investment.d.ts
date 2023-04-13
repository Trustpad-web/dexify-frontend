import { FundDto, FundOverview } from "./fund";
import { FundStateDto } from "./fundState";

export class InvestmentDto {
    stateHistory: InvestmentStateDto[];
    shares: string;
    fund: FundOverview
}

export class InvestmentStateDto {
    timestamp: string;
    shares: string;
    fundState: FundStateDto
}