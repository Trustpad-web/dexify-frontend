import { CurrencyDto, CurrencyPriceDto } from "./currency";
import { HoldingDto } from "./holding";
import { PortfolioDto } from "./portfolio";

export type FundStateDto = {
  currencyPrices: CurrencyPriceDto[];
  portfolio?: PortfolioDto;
};
