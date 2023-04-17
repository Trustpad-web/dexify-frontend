import { AssetPriceDto } from "./assetPrice"

export type AssetDto = {
    id: string,
    symbol: string,
    name: string,
    decimals: number,
    price?: AssetPriceDto,
    priceHistory?: AssetPriceDto[],
    daily?: {
        open: string
    }
    amount?: number
}