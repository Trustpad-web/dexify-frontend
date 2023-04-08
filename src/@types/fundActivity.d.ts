import { SharesBoughtDto } from "./sharesBought"
import { SharesRedeemedDto } from "./sharesRedeemed";

export type FundActivityDto = {
    sharesBoughtEvents: SharesBoughtDto[];
    sharesRedeemedEvents: SharesRedeemedDto[];
}