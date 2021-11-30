import * as React from "react";
import { AppProps } from "next/app";
import "../style.css";
import Head from "next/head";
import { CalculatorContextApp } from "../contexts/CalculatorContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Kiwi dApp</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <CalculatorContextApp>
        <Component {...pageProps} />
      </CalculatorContextApp>
    </>
  );
}
