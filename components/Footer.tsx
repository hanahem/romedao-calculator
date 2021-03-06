import React from "react";
import { FaTwitter, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="flex items-center justify-between w-full xl:m-auto mt-4">
      <span className="text-gray-400 text-sm font-light">
        Not affiliated to <a className="underline" href="https://romedao.finance">RomeDAO</a>
      </span>
      <div className="flex items-center gap-4 text-gray-500">
        <a href="https://twitter.com/0Xethercake" target="_blank" rel="noreferrer">
          <FaTwitter size={15} />
        </a>
        <a href="https://github.com/hanahem" target="_blank" rel="noreferrer">
          <FaGithub size={15} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
