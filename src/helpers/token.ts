import tokenList from '../constants/tokenlists.json'
export const getTokenInfo = (tokenAddress: string) => {
    const token = tokenList.find(token => token.address.toLowerCase() === tokenAddress.toLowerCase());
    return token;
}