import axios from "axios";
import { ethers } from "ethers";
import fromExponential from "from-exponential";
import { romeFraxPair } from "../abis/romeFraxPair.abi";
import { addresses } from "./constants";

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=olympus,chainlink,curve-dao-token,frax-share&vs_currencies=usd";
  const { data } = await axios.get(url);

  cache["OHM"] = data["olympus"].usd;
  cache["CRV"] = data["curve-dao-token"].usd;
  cache["FXS"] = data["frax-share"].usd;
};

export const getTokenPrice = (symbol: string): number => {
  return Number(cache[symbol]);
};

export async function getMarketPrice(
  provider: ethers.Signer | ethers.providers.Provider
): Promise<number> {
  const pairContract = new ethers.Contract(
    addresses.romeFraxPair,
    romeFraxPair,
    provider
  );
  const reserves = await pairContract.getReserves();
  const marketPrice = reserves[0] / reserves[1];
  return marketPrice;
}

export const trim = (number: number = 0, precision?: number) => {
  const array = fromExponential(number).split(".");
  if (array.length === 1) return fromExponential(number);
  //@ts-ignore
  array.push(array.pop().substring(0, precision));
  const trimmedNumber = array.join(".");
  return trimmedNumber;
};
