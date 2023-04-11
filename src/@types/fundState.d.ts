import { CurrencyDto, CurrencyPriceDto } from "./currency";
import { HoldingDto } from "./holding";
import { PortfolioDto } from "./portfolio";
import { ShareStateDto } from "./share";

export type FundStateDto = {
  currencyPrices: CurrencyPriceDto[];
  portfolio?: PortfolioDto;
  shares?: ShareStateDto
};
