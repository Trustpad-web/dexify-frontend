import { CurrencyDto } from "./currency"
import { HoldingDto } from "./holding"

export type FundStateDto = {
    currencyPricies: CurrencyDto[],
    portfolio?: HoldingDto[]
}