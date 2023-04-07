import { AssetDto } from "./asset"
import { AssetPriceDto } from "./assetPrice"

export type HoldingDto = {
    amount: string,
    asset: AssetDto,
    price: AssetPriceDto
}