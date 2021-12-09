import React, { useEffect, useState } from "react";
import useCalculator from "../contexts/CalculatorContext";
import { tokens } from "../utils/constants";
import { trim } from "../utils/utils";

const { TOKEN_NAME } = tokens;

const BondStake = () => {
  const calculatorCtx = useCalculator();
  const { metrics } = calculatorCtx;
  const { stakingRebase, marketPrice } = metrics;

  const stakingRebasePercentage = trim(stakingRebase * 100, 4);

  const [investment, setInvestment] = useState<number | undefined>();
  const [price, setPrice] = useState<number | undefined>();
  const [bondDiscount, setBondDiscount] = useState<number | undefined>();
  const [rebaseRate, setRebaseRate] = useState<number | undefined>();
  const [fee, setFee] = useState<number | undefined>();

  const [netPrice, setNetPrice] = useState<number | undefined>(0);
  const [amount, setAmount] = useState<number | undefined>(0);
  const [amountDisc, setAmountDisc] = useState<number | undefined>(0);
  const [staking5d, setStaking5d] = useState<number | undefined>(0);
  const [accuredBR, setAccuredBR] = useState<number | undefined>(0);

  const [fStakingReturn, setFStakingReturn] = useState<number | undefined>(0);
  const [fBondingReturn, setFBondingReturn] = useState<number | undefined>(0);

  function stakingMachine(amount: number, rebaseRate: number) {
    let rome = (amount * rebaseRate) / 100 + amount;
    for (let i = 0; i < 15; i++) {
      const roi = Math.pow(1 + ((rebaseRate / 100) as number), i + 1) - 1;
      rome = amount * roi + amount;
    }
    return rome;
  }

  function bondingMachine(
    accuredBR: number,
    rebaseRate: number,
    price: number,
    fee: number
  ) {
    let rome = (accuredBR * rebaseRate) / 100 + accuredBR;
    for (let i = 0; i < 15; i++) {
      rome =
        rome +
        accuredBR +
        (rome + accuredBR) * (rebaseRate / 100) -
        fee / price;
    }
    return rome;
  }

  const setCurrent = (type: string) => {
    if (type === "price") {
      setPrice(marketPrice);
    } else {
      setRebaseRate(parseFloat(stakingRebasePercentage));
    }
  };

  useEffect(() => {
    if (price && bondDiscount) {
      const net = price * (1 - bondDiscount / 100);
      setNetPrice(net);
    }
  }, [price, bondDiscount]);

  useEffect(() => {
    if (price && investment) {
      const a = investment / price;
      setAmount(a);
    }
  }, [investment, price]);

  useEffect(() => {
    if (netPrice && investment) {
      const a = investment / netPrice;
      setAmountDisc(a);
    }
  }, [investment, netPrice]);

  useEffect(() => {
    if (rebaseRate) {
      const rate = Math.pow(1 + rebaseRate / 100, 15) - 1;
      setStaking5d(rate * 100);
    }
  }, [rebaseRate]);

  useEffect(() => {
    if (amountDisc) {
      const a = amountDisc / 15;
      setAccuredBR(a);
    }
  }, [amountDisc]);

  useEffect(() => {
    if (amount && accuredBR && rebaseRate && price) {
      const r = stakingMachine(amount, rebaseRate);
      const rB = bondingMachine(accuredBR, rebaseRate, price, fee || 0);
      setFStakingReturn(r);
      setFBondingReturn(rB);
    }
  }, [amount, accuredBR, rebaseRate, fee, price]);

  return (
    <div className="metric mx-auto mb-8 xl:w-1/2">
      <div className="w-full flex flex-col justify-start items-start mb-4">
        <p className="font-bold text-lg">Bond vs Stake</p>
        <p className="text-gray-600 text-sm">
          Enter the data and estimate if it's more profitable to bond vs stake
        </p>
      </div>
      <div className="flex flex-col w-full gap-2">
        <div className="flex items-center justify-between gap-2">
          <input
            className="w-full"
            type="number"
            placeholder={`Investment ($)`}
            value={investment}
            onChange={(e) => setInvestment(parseFloat(e.target.value))}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <input
            className="w-full"
            type="number"
            placeholder={`${TOKEN_NAME} price ($)`}
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
          <button onClick={() => setCurrent("price")}>
            <p>Current</p>
          </button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <input
            className="w-full"
            type="number"
            placeholder={`Bond Discount (ROI%)`}
            value={bondDiscount}
            onChange={(e) => setBondDiscount(parseFloat(e.target.value))}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <input
            className="w-full"
            type="number"
            placeholder={`Rebase Rate (%)`}
            value={rebaseRate}
            onChange={(e) => setRebaseRate(parseFloat(e.target.value))}
          />
          <button onClick={() => setCurrent("rebaseRate")}>
            <p>Current</p>
          </button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <input
            className="w-full"
            type="number"
            placeholder={`Stake / Claim-to-stake fee ($)`}
            value={fee}
            onChange={(e) => setFee(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <div className="mt-4 w-full">
        <div className="flex items-center justify-between w-full">
          <p className="w-1/5 text-sm">Price after discount</p>
          <div className="border border-gray-300 flex-grow" />
          <p className="ml-3">
            ${new Intl.NumberFormat("en-US").format(Number(netPrice))}
          </p>
        </div>
        <div className="flex items-center justify-between w-full mt-2">
          <p className="w-1/5 text-sm">Amount purchased</p>
          <div className="border border-gray-300 flex-grow" />
          <p className="ml-3">
            {new Intl.NumberFormat("en-US").format(Number(amount))} ROME
          </p>
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="w-1/5 text-sm">Amount bonded</p>
          <div className="border border-gray-300 flex-grow" />
          <p className="ml-3">
            {new Intl.NumberFormat("en-US").format(Number(amountDisc))} ROME
          </p>
        </div>
        <div className="flex items-center justify-between w-full mt-2">
          <p className="w-1/5 text-sm">5-day staking rate</p>
          <div className="border border-gray-300 flex-grow" />
          <p className="ml-3">
            {new Intl.NumberFormat("en-US").format(Number(staking5d))}%
          </p>
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="w-1/5 text-sm">5-day bonding rate</p>
          <div className="border border-gray-300 flex-grow" />
          <p className="ml-3">
            {bondDiscount
              ? new Intl.NumberFormat("en-US").format(Number(bondDiscount))
              : 0}
            %
          </p>
        </div>
        <div className="flex items-center justify-between w-full mt-2">
          <p className="w-1/5 text-sm">Accured before rebases</p>
          <div className="border border-gray-300 flex-grow" />
          <p className="ml-3">
            {new Intl.NumberFormat("en-US").format(Number(accuredBR))} ROME
          </p>
        </div>

        <div className="flex items-center justify-between w-full mt-4">
          <p className="w-1/5 text-sm">Final staking returns ({TOKEN_NAME})</p>
          <div className="border border-gray-300 flex-grow" />
          <p className="ml-3">
            {new Intl.NumberFormat("en-US").format(Number(fStakingReturn))}{" "}
            {TOKEN_NAME}
          </p>
        </div>
        {price && fStakingReturn ? (
          <div className="flex items-center justify-between w-full">
            <p className="w-1/5 text-sm">Final staking returns ($)</p>
            <div className="border border-gray-300 flex-grow" />
            <p className="ml-3 font-semibold">
              $
              {new Intl.NumberFormat("en-US").format(
                Number(fStakingReturn * price)
              )}
            </p>
          </div>
        ) : null}

        <div className="flex items-center justify-between w-full mt-4">
          <p className="w-1/5 text-sm">Final bonding returns ({TOKEN_NAME})</p>
          <div className="border border-gray-300 flex-grow" />
          <p className="ml-3">
            {new Intl.NumberFormat("en-US").format(Number(fBondingReturn))}{" "}
            {TOKEN_NAME}
          </p>
        </div>
        {price && fBondingReturn ? (
          <div className="flex items-center justify-between w-full">
            <p className="w-1/5 text-sm">Final bonding returns ($)</p>
            <div className="border border-gray-300 flex-grow" />
            <p className="ml-3 font-semibold">
              $
              {new Intl.NumberFormat("en-US").format(
                Number(fBondingReturn * price)
              )}
            </p>
          </div>
        ) : null}
      </div>

      <div className="font-bold text-xl text-brand mt-4">
        {fStakingReturn && fBondingReturn
          ? fStakingReturn > fBondingReturn
            ? "STAKE"
            : "BOND"
          : "Enter the data first"}
      </div>
    </div>
  );
};

export default BondStake;
