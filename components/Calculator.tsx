import React, { SyntheticEvent, useState } from "react";
import useCalculator from "../contexts/CalculatorContext";
import { tokens } from "../utils/constants";
import { trim } from "../utils/utils";

const Calculator = () => {
  const [balance, setBalance] = useState();

  const calculatorCtx = useCalculator();
  const { loaded, metrics } = calculatorCtx;
  const { stakingRebase, stakingAPY, marketPrice, epoch } = metrics;
  const { TOKEN_NAME, STAKING_TOKEN_NAME } = tokens;

  const trimmedStakingAPY = trim(stakingAPY * 100, 1);

  console.log("=====METRICS=====");
  console.log(metrics);

  const [quantity, setQuantity] = useState<string>("");
  const [rewardYield, setRewardYield] = useState<string>("");
  const [lobiPrice, setLobiPrice] = useState<string>("");
  const [days, setDays] = useState<number>(30);
  const [futureLobiPrice, setFutureLobiPrice] = useState<string>("");
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
        setLobiPrice(marketPrice.toString());
        break;
      case "futurePrice":
        setFutureLobiPrice(marketPrice.toString());
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
  const initialInvestment = parseFloat(lobiPrice) * parseFloat(quantity);
  const potentialReturn =
    parseFloat(futureLobiPrice) * (totalReturn + Number(quantity)) -
    initialInvestment;
  const daysUntilTwoTimes =
    Math.log(2) / Math.log(1 + Number(rewardYield) / 100) / dailyRebaseAmounts;
  const daysUntilFiveTimes =
    Math.log(5) / Math.log(1 + Number(rewardYield) / 100) / dailyRebaseAmounts;
  const daysUntilTenTimes =
    Math.log(10) / Math.log(1 + Number(rewardYield) / 100) / dailyRebaseAmounts;

  return (
    <div className="stake-view">
      <div>
        <div className="stake-card">
          <div className="div gap-2">
            <div>
              <div className="stake-card-header">
                <p className="stake-card-header-title">Calculator</p>
                <p className="stake-card-header-description">
                  Please fill the inputs to simulate your rewards
                </p>
              </div>
            </div>

            <div>
              <div className="stake-card-metrics">
                <div>
                  <div>
                    <div className="stake-card-apy">
                      <p className="stake-card-metrics-title">
                        {TOKEN_NAME} Price
                      </p>
                      <p className="stake-card-metrics-value">
                        {!loaded ? (
                          <p>{"LOADING"}</p>
                        ) : (
                          `$${trim(marketPrice, 2)}`
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    {!loaded ? (
                      <p>Loading</p>
                    ) : parseFloat(trimmedStakingAPY) > 100000000 ? (
                      "100,000,000% +"
                    ) : (
                      `${new Intl.NumberFormat("en-US").format(
                        Number(trimmedStakingAPY)
                      )}%`
                    )}
                  </div>

                  <div>
                    <div className="stake-card-tvl">
                      <p className="stake-card-metrics-title">
                        Current Reward Yield
                      </p>
                      <p className="stake-card-metrics-value">
                        {!loaded ? (
                          <p>{"LOADING"}</p>
                        ) : (
                          <>{stakingRebasePercentage}%</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="stake-card-index">
                      <p className="stake-card-metrics-title">
                        Your {STAKING_TOKEN_NAME} Balance
                      </p>
                      <p className="stake-card-metrics-value">
                        {loaded ? (
                          <p>{"LOADING"}</p>
                        ) : (
                          <>
                            {trimmedSLobiBalance} {STAKING_TOKEN_NAME}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="stake-card-area">
              <div>
                <div className="stake-card-action-area">
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      placeholder={`${STAKING_TOKEN_NAME} amount`}
                      className="stake-card-action-input"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      placeholder={`APY (%)`}
                      className="stake-card-action-input"
                      value={apy}
                      onChange={(e) => handleAPY(e.target.value)}
                    />
                    <button onClick={() => setCurrent("apy")}>
                      <p>Current</p>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      placeholder={`Reward yield each rebase (%)`}
                      className="stake-card-action-input"
                      value={rewardYield}
                      onChange={(e) => handleRewardYield(e.target.value)}
                    />
                    <button onClick={() => setCurrent("rewardYield")}>
                      <p>Current</p>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      placeholder={`${TOKEN_NAME} price at purchase ($) `}
                      className="stake-card-action-input"
                      value={lobiPrice}
                      onChange={(e) => setLobiPrice(e.target.value)}
                    />
                    <button onClick={() => setCurrent("setPrice")}>
                      <p>Current</p>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      placeholder={`Future ${TOKEN_NAME} market price ($)`}
                      className="stake-card-action-input"
                      value={futureLobiPrice}
                      onChange={(e) => setFutureLobiPrice(e.target.value)}
                    />
                    <button onClick={() => setCurrent("futurePrice")}>
                      <p>Current</p>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    {/* <Slider className="slider" min={1} max={365} onChange={(e, val) => handleDays(val)} value={days} />{" "} */}
                    <input
                      placeholder="days"
                      type="number"
                      onChange={(e: SyntheticEvent) => handleDays(e)}
                    />
                    <p className="days-text">
                      {days} {days === 1 ? "Day" : "Days"}
                    </p>
                  </div>
                </div>

                <div className="stake-user-data">
                  <div className="data-row">
                    <p className="data-row-name">Your Initial Investment</p>
                    <p className="data-row-value">
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

                  <div className="data-row">
                    <p className="data-row-name">{`${TOKEN_NAME} rewards estimation`}</p>
                    <p className="data-row-value">
                      {totalReturn > 0
                        ? `${trim(totalReturn, 4)} ${TOKEN_NAME}`
                        : `0 ${TOKEN_NAME}`}
                    </p>
                  </div>

                  <div className="data-row">
                    <p className="data-row-name">Total return</p>
                    <p className="data-row-value">
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
                  {rewardYield !== "" && (
                    <div style={{ width: "100%" }}>
                      <hr />
                    </div>
                  )}
                </div>
              </div>
              )
              {rewardYield !== "" && (
                <div className="stake-user-data">
                  <div className="data-row">
                    <p className="data-row-name">Amount of days Until...</p>
                    <p className="data-row-value"></p>
                  </div>
                  <div className="data-row">
                    <p className="data-row-name">2x {STAKING_TOKEN_NAME}</p>
                    <p className="data-row-value">
                      {trim(daysUntilTwoTimes, 1)}{" "}
                      {daysUntilTwoTimes > 1 ? "Days" : "Day"}
                    </p>
                  </div>
                  <div className="data-row">
                    <p className="data-row-name">5x {STAKING_TOKEN_NAME}</p>
                    <p className="data-row-value">
                      {trim(daysUntilFiveTimes, 1)}{" "}
                      {daysUntilTwoTimes > 1 ? "Days" : "Day"}
                    </p>
                  </div>
                  <div className="data-row">
                    <p className="data-row-name">10x {STAKING_TOKEN_NAME}</p>
                    <p className="data-row-value">
                      {trim(daysUntilTenTimes, 1)}{" "}
                      {daysUntilTwoTimes > 1 ? "Days" : "Day"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
