import { InvestmentDto } from "./investment";
import { InvestmentSharesChangeDto } from "./investmentSharesChange"

export type AccountDto = {
    id: string,
    firstSeen: string,
    investorSince: string,
    investmentSharesChanges?: InvestmentSharesChangeDto[];
    investments?: InvestmentDto[]
}