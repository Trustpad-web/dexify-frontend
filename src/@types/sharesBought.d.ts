import { ComptrollerDto } from "./comptroller";
import { FundStateDto } from "./fundState";
import { TransactionDto } from "./transaction";

export type SharesBoughtDto = {
    timestamp: string;
    investor?: {
        id: string
    };
    fund?: {
        id: string,
        name: string,
        accessor: ComptrollerDto
    },
    investmentAmount: string;
    shares: string;
    fundState: FundStateDto
    transaction: TransactionDto
}