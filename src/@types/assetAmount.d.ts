import { AssetDto } from "./asset"
import { AssetPriceDto } from "./assetPrice"

export type AssetAmountDto = {
    amount: string,
    price: AssetPriceDto,
    asset: AssetDto
}