import { useEffect, useState } from "react";
import useCalculator from "../contexts/CalculatorContext";
import { prettifySeconds, secondsUntilBlock } from "../utils/utils";

function RebaseTimer() {
  const calcCtx = useCalculator();
  const { nextRebase, currentBlockTime } = calcCtx.metrics;

  const [timeUntilRebase, setTimeUntilRebase] = useState("");
  useEffect(() => {
    if (currentBlockTime && nextRebase) {
      const seconds = secondsUntilBlock(currentBlockTime, nextRebase);
      const time = prettifySeconds(seconds * -Math.pow(10, -6));
      setTimeUntilRebase(time);
    }
  }, [currentBlockTime, nextRebase]);

  return (
    <div className="flex items-baseline">
      <span className="font-semibold text-brand">
        {currentBlockTime ? (
          timeUntilRebase ? (
            <>
              <strong>{timeUntilRebase}</strong>{" "}
              <p className="text-xs">to next rebase</p>
            </>
          ) : (
            <strong>Rebasing</strong>
          )
        ) : (
          <p>LOADING</p>
        )}
      </span>
    </div>
  );
}

export default RebaseTimer;
