import { utils } from "ethers";

/**
 * @public
 */
export function shortenAddress(address: string): string {
  try {
    const formattedAddress = utils.getAddress(address);
    return shortenString(formattedAddress);
  } catch {
    throw new TypeError("Invalid input, address can't be parsed");
  }
}

export function shortenString(str: string) {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
}

export function getAdapterNameById(id: string) {
  switch(id) {
    case "PARA_SWAP_V5":
      return "Paraswap V5";
    default:
      return "Pancakeswap";
  }
}

export function getTradeMethodName(identifier: string) {
  switch (identifier) {
    case "TAKE_ORDER":
      return "Swap";
    default:
      return "Swap";
  }
}