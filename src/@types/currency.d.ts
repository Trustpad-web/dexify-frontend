export type CurrencyDto = {
    id: string;
    price?: CurrencyPriceDto,
    daily?: {
        open: string
    },
    priceHistory?: CurrencyPriceDto[]
}

export type CurrencyPriceDto = {
    timestamp: string,
    price: string
}