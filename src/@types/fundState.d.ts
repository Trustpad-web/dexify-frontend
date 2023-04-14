import { CurrencyDto, CurrencyPriceDto } from "./currency";
import { FundDto } from "./fund";
import { HoldingDto } from "./holding";
import { PortfolioDto } from "./portfolio";
import { ShareStateDto } from "./share";

export type FundStateDto = {
  currencyPrices: CurrencyPriceDto[];
  portfolio?: PortfolioDto;
  shares?: ShareStateDto;
  fund?: FundDto,
  timestamp?: string,
};
