import { Adapter } from "./adapter";
import { AssetAmountDto } from "./assetAmount";
import { CurrencyPriceDto } from "./currency";
import { FundOverview } from "./fund";

export class TradeHistoryDto {
    tokenSwapTrades: TokenSwapTrade[];
}

export class TokenSwapTrade {
    timestamp: string;
    adapter: Adapter;
    method: string;
    fund: FundOverview;
    incomingAssetAmount: AssetAmountDto;
    outgoingAssetAmount: AssetAmountDto;
    price: string;
    fundState: {
        currencyPrices: CurrencyPriceDto[];
    }
}