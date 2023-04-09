import { HoldingDto } from "./holding"

export type PortfolioDto = {
    timestamp?: string,
    holdings: HoldingDto[]
}