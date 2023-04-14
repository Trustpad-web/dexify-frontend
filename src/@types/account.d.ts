import { InvestmentDto } from "./investment";
import { InvestmentSharesChangeDto } from "./investmentSharesChange"
import { ManagementDto } from "./management";

export type AccountDto = {
    id: string,
    firstSeen?: string,
    investorSince?: string,
    investor?: boolean,
    manager?: boolean,
    managerSince?: string
    investmentSharesChanges?: InvestmentSharesChangeDto[];
    investments?: InvestmentDto[];
    managements?: ManagementDto[];
}