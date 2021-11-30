import { ethers } from "ethers";
import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import useCalculator from "../contexts/CalculatorContext";
import { tokens } from "../utils/constants";
import { prettifySeconds, secondsUntilBlock, trim } from "../utils/utils";
import RebaseTimer from "./RebaseTimer";

const Calculator = () => {
  const [balance, setBalance] = useState(30);

  const calculatorCtx = useCalculator();
  const { loaded, metrics } = calculatorCtx;
  const {
    stakingRebase,
    stakingAPY,
    marketPrice,
    epoch,
    currentIndex,
    circSupply,
    fiveDayRate,
    marketCap,
    stakingTVL,
    totalSupply,
  } = metrics;
  const { TOKEN_NAME, STAKING_TOKEN_NAME } = tokens;

  const trimmedStakingAPY = trim(stakingAPY * 100, 1);

  console.log("=====METRICS=====");
  console.log(metrics);

  const [quantity, setQuantity] = useState<string>("");
  const [rewardYield, setRewardYield] = useState<string>("");
  const [romePrice, setRomePrice] = useState<string>("");
  const [days, setDays] = useState<number>(30);
  const [futureRomePrice, setFutureRomePrice] = useState<string>("");
  const [apy, setApy] = useState<string>("");

  const handleDays = (e: SyntheticEvent) => {
    const tg = e.target as HTMLInputElement;
    const newValue = tg.value;
    setDays(Number(newValue) as number);
  };
  const handleAPY = (value: string) => {
    setApy(value);
    const newRewardYield =
      (Math.pow(Number(value) / 100, 1 / (365 * dailyRebaseAmounts)) - 1) * 100;
    setRewardYield(trim(newRewardYield, 4).toString());
    if (value === "") {
      setRewardYield("");
    }
  };
  const handleRewardYield = (value: string) => {
    setRewardYield(value);
    const newAPY =
      (Math.pow(1 + Number(value) / 100, 365 * dailyRebaseAmounts) - 1) * 100;
    setApy(trim(newAPY, 4).toString());
    if (value === "") {
      setApy("");
    }
  };
  const setCurrent = (type: string) => {
    switch (type) {
      case "rewardYield":
        setRewardYield(stakingRebasePercentage);
        const newAPY =
          (Math.pow(
            1 + Number(stakingRebasePercentage) / 100,
            365 * dailyRebaseAmounts
          ) -
            1) *
          100;
        setApy(trim(newAPY, 4).toString());
        break;
      case "setPrice":
        setRomePrice(marketPrice.toString());
        break;
      case "futurePrice":
        setFutureRomePrice(marketPrice.toString());
        break;
      case "apy":
        setApy(trimmedStakingAPY);
        break;
    }
  };

  const trimmedSLobiBalance = trim(Number(balance));
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const blockSecondLength = 13;
  const rebaseTimeInSeconds = epoch ? epoch[0] * blockSecondLength : 28800;
  const dailyRebaseAmounts = 86400 / rebaseTimeInSeconds;
  const totalReturn =
    (Math.pow(1 + Number(rewardYield) / 100, days * dailyRebaseAmounts) - 1) *
    Number(quantity);
  const initialInvestment = parseFloat(romePrice) * parseFloat(quantity);
  const potentialReturn =
    parseFloat(futureRomePrice) * (totalReturn + Number(quantity)) -
    initialInvestment;
  const daysUntilTwoTimes =
    Math.log(2) / Math.log(1 + Number(rewardYield) / 100) / dailyRebaseAmounts;
  const daysUntilFiveTimes =
    Math.log(5) / Math.log(1 + Number(rewardYield) / 100) / dailyRebaseAmounts;
  const daysUntilTenTimes =
    Math.log(10) / Math.log(1 + Number(rewardYield) / 100) / dailyRebaseAmounts;

  const otherMetricsTable: { label: string; value: string; unit: string }[] = [
    { label: "Current Index", value: trim(currentIndex, 4), unit: "ROME" },
    { label: "Circulating Supply", value: trim(circSupply, 4), unit: "ROME" },
    {
      label: "Market Cap",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      }).format(marketCap),
      unit: "",
    },
    {
      label: "Market Price",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      }).format(marketPrice),
      unit: "",
    },
    { label: "Total Supply", value: trim(totalSupply, 4), unit: "ROME" },
    { label: "5-day Rate", value: trim(fiveDayRate, 4), unit: "%" },
    { label: "Staking APY", value: trim(stakingAPY, 4), unit: "%" },
    { label: "Staking Rebase", value: trim(stakingRebase, 4), unit: "%" },
    {
      label: "Staking TVL",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      }).format(stakingTVL),
      unit: "",
    },
  ];

  return (
    <div className="flex flex-col xl:flex-row justify-center items-center xl:items-start gap-8">
      {/* FORM */}
      <div className="flex flex-col gap-4">
        <div className="metric">
          <img
            src="/images/banner.png"
            alt="Banner"
            className="rounded-xl w-80"
          />
          <h1 className="text-2xl mt-2 text-gray-800 font-black">
            {"RomeDAO Rewards Calculator"}
          </h1>
          <div className="h-1 w-full bg-brand"/>
        </div>

        <div className="metric">
          <div className="w-full flex flex-col justify-start items-start mb-4">
            <p className="font-bold text-lg">Estimate Returns</p>
            <p className="text-gray-600 text-sm">
              Enter the data to use the calculator
            </p>
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="number"
                  placeholder={`${STAKING_TOKEN_NAME} amount`}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="number"
                  placeholder={`APY (%)`}
                  value={apy}
                  onChange={(e) => handleAPY(e.target.value)}
                />
                <button onClick={() => setCurrent("apy")}>
                  <p>Current</p>
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="number"
                  placeholder={`Reward yield each rebase (%)`}
                  value={rewardYield}
                  onChange={(e) => handleRewardYield(e.target.value)}
                />
                <button onClick={() => setCurrent("rewardYield")}>
                  <p>Current</p>
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="number"
                  placeholder={`${TOKEN_NAME} price at purchase ($) `}
                  value={romePrice}
                  onChange={(e) => setRomePrice(e.target.value)}
                />
                <button onClick={() => setCurrent("setPrice")}>
                  <p>Current</p>
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="number"
                  placeholder={`Future ${TOKEN_NAME} market price ($)`}
                  value={futureRomePrice}
                  onChange={(e) => setFutureRomePrice(e.target.value)}
                />
                <button onClick={() => setCurrent("futurePrice")}>
                  <p>Current</p>
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <input
                  placeholder="days"
                  type="number"
                  onChange={(e: SyntheticEvent) => handleDays(e)}
                />
                <p className="m-auto">
                  {days} {days === 1 ? "Day" : "Days"}
                </p>
              </div>
            </div>

            <div className="w-full mt-4">
              <div className="w-full flex items-center justify-between">
                <p>Your Initial Investment</p>
                <p>
                  {!loaded ? (
                    <p>{"LOADING"}</p>
                  ) : (
                    <>
                      {initialInvestment > 0
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 5,
                            minimumFractionDigits: 0,
                          }).format(initialInvestment)
                        : new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          }).format(0)}
                    </>
                  )}
                </p>
              </div>

              <div className="w-full flex items-center justify-between">
                <p>{`${TOKEN_NAME} rewards estimation`}</p>
                <p>
                  {totalReturn > 0
                    ? `${trim(totalReturn, 4)} ${TOKEN_NAME}`
                    : `0 ${TOKEN_NAME}`}
                </p>
              </div>

              <div className="w-full flex items-center justify-between">
                <p>Total return</p>
                <p>
                  {!isNaN(potentialReturn)
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 5,
                        minimumFractionDigits: 0,
                      }).format(potentialReturn)
                    : "--"}
                </p>
              </div>
            </div>
          </div>

          {rewardYield !== "" && (
            <div className="w-full mt-4">
              <div>
                <p>Amount of days Until...</p>
                <p></p>
              </div>
              <div className="w-full flex items-center justify-between">
                <p>2x {STAKING_TOKEN_NAME}</p>
                <p>
                  {trim(daysUntilTwoTimes, 1)}{" "}
                  {daysUntilTwoTimes > 1 ? "Days" : "Day"}
                </p>
              </div>
              <div className="w-full flex items-center justify-between">
                <p>5x {STAKING_TOKEN_NAME}</p>
                <p>
                  {trim(daysUntilFiveTimes, 1)}{" "}
                  {daysUntilTwoTimes > 1 ? "Days" : "Day"}
                </p>
              </div>
              <div className="w-full flex items-center justify-between">
                <p>10x {STAKING_TOKEN_NAME}</p>
                <p>
                  {trim(daysUntilTenTimes, 1)}{" "}
                  {daysUntilTwoTimes > 1 ? "Days" : "Day"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* METRICS */}
      <div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          <div className="metric">
            <p>{TOKEN_NAME} Price</p>
            <h6>{!loaded ? <p>{"LOADING"}</p> : `$${trim(marketPrice, 2)}`}</h6>
          </div>

          <div className="metric">
            <p>APY</p>
            <h6>
              {!loaded ? (
                <p>Loading</p>
              ) : parseFloat(trimmedStakingAPY) > 100000000 ? (
                "100,000,000% +"
              ) : (
                `${new Intl.NumberFormat("en-US").format(
                  Number(trimmedStakingAPY)
                )}%`
              )}
            </h6>
          </div>

          <div className="metric">
            <p>Current Reward Yield</p>
            <h6>
              {!loaded ? <p>{"LOADING"}</p> : <>{stakingRebasePercentage}%</>}
            </h6>
          </div>

          <div className="metric">
            <p>Your {STAKING_TOKEN_NAME} Balance</p>
            <h6>
              {loaded ? (
                "LOADING"
              ) : (
                <>
                  {trimmedSLobiBalance} {STAKING_TOKEN_NAME}
                </>
              )}
            </h6>
          </div>
        </div>

        <div className="metric gap-2 my-4">
          {otherMetricsTable.map(
            (metric: { label: string; value: string; unit: string }) => (
              <div
                key={metric.label}
                className="w-full px-2 py-1 bg-white rounded-md flex items-center justify-between"
              >
                <span className="font-normal text-xs text-gray-600">
                  {metric.label}
                </span>
                <span className="font-semibold text-brand">
                  {metric.value} {metric.unit}
                </span>
              </div>
            )
          )}
          <div className="w-full px-2 py-1 bg-white rounded-md flex items-center justify-between">
            <span className="font-normal text-xs text-gray-600">
              {"Next Rebase"}
            </span>
            <RebaseTimer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
