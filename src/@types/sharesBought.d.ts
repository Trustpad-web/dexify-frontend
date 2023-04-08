import { FundStateDto } from "./fundState";

export type SharesBoughtDto = {
    timestamp: string;
    investmentAmount: string;
    shares: string;
    fundState: FundStateDto
}