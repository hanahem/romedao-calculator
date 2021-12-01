import React from "react";
import { FaTwitter, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="p-4 flex items-center justify-between w-full">
      <span className="text-gray-400 text-sm font-light">
        Not affiliated to <a className="underline" href="https://romedao.finance">RomeDAO</a>
      </span>
      <div className="flex items-center gap-4 text-gray-500">
        <a href="https://twitter.com/0Xethercake" target="_blank">
          <FaTwitter size={15} />
        </a>
        <a href="https://github.com/hanahem" target="_blank">
          <FaGithub size={15} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
