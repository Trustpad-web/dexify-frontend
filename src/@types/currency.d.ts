export type CurrencyDto = {
    id: string;
    price?: CurrencyPriceDto,
    priceHistory?: CurrencyPriceDto[]
}

export type CurrencyPriceDto = {
    timestamp: string,
    price: string
}