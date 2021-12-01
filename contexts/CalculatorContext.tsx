import { ethers } from "ethers";
import { useEffect, useContext, createContext, useState } from "react";
import { romeAbi } from "../abis/rome.abi";
import { sRomeAbi } from "../abis/sRome.abi";
import { stakingAbi } from "../abis/staking.abi";
import { addresses } from "../utils/constants";
import { Metrics } from "../utils/types";
import { getMarketPrice } from "../utils/utils";

/*************************************
 **	Default states for metrics
 *************************************/
const defaultMetrics: Metrics = {
  currentIndex: 0,
  totalSupply: 0,
  marketCap: 0,
  currentBlock: 0,
  circSupply: 0,
  fiveDayRate: 0,
  stakingAPY: 0,
  stakingTVL: 0,
  stakingRebase: 0,
  marketPrice: 0,
  currentBlockTime: 0,
  nextRebase: 0,
  epoch: [0],
};

const Calculator = createContext({ metrics: defaultMetrics, loaded: false });

export const CalculatorContextApp = ({ children }: any) => {
  const providerURL = "https://rpc.moonriver.moonbeam.network";
  // Define Provider
  const provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
    chainId: 1285,
    name: "moonriver",
  });

  const [loaded, setLoaded] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>(defaultMetrics);

  /************************************
   **	Fetches & updates metrics
   ************************************/
  async function loadMetrics(provider: ethers.providers.Provider) {
    const stakingContract = new ethers.Contract(
      addresses.staking,
      stakingAbi,
      provider
    );
    const currentBlock = await provider.getBlockNumber();
    const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;

    const sRomeContract = new ethers.Contract(
      addresses.sRome,
      sRomeAbi,
      provider
    );
    const romeContract = new ethers.Contract(addresses.rome, romeAbi, provider);

    const marketPrice = await getMarketPrice(provider);

    const totalSupply = (await romeContract.totalSupply()) / Math.pow(10, 9);
    const circSupply =
      (await sRomeContract.circulatingSupply()) / Math.pow(10, 9);

    const stakingTVL = circSupply * marketPrice;
    const marketCap = totalSupply * marketPrice;

    const epoch = await stakingContract.epoch();
    const blockSecondLength = 13;
    const rebaseTimeInSeconds = epoch[0] * blockSecondLength;
    const dailyRebaseAmounts = 86400 / rebaseTimeInSeconds;
    const stakingReward = epoch.distribute;
    const circ = await sRomeContract.circulatingSupply();
    const stakingRebase = stakingReward / circ;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * dailyRebaseAmounts) - 1;
    const stakingAPY =
      Math.pow(1 + stakingRebase, 365 * dailyRebaseAmounts) - 1;

    const currentIndex = await stakingContract.index();
    const nextRebase = epoch.endBlock;

    setMetrics({
      currentIndex: Number(ethers.utils.formatUnits(currentIndex, "gwei")),
      totalSupply,
      marketCap: marketCap * Math.pow(10, -9),
      currentBlock,
      circSupply,
      fiveDayRate,
      stakingAPY,
      stakingTVL: stakingTVL * Math.pow(10, -9),
      stakingRebase,
      marketPrice: marketPrice * Math.pow(10, -9),
      currentBlockTime,
      nextRebase,
      epoch,
    });

    setLoaded(true);
  }

  useEffect(() => {
    if (provider) {
      setLoaded(false);
      loadMetrics(provider);
    }
  }, []);

  return (
    <Calculator.Provider value={{ metrics, loaded }}>
      {children}
    </Calculator.Provider>
  );
};

export const useCalculator = () => useContext(Calculator);
export default useCalculator;
