import React from "react";
import Calculator from "../components/Calculator";

const IndexPage = () => {
  return (
    <div>
      <Calculator />
      {/* <div className="metric w-2/3 md:w-1/2 flex flex-col xl:flex-row justify-center items-center xl:items-start my-8">
        <span className="text-gray-500 w-full flex items-center justify-between">
          <p>Not affiliated to RomeDAO</p>
          <span className="flex gap-2">
            <a href="https://twitter.com/0Xethercake" target="_blank">
              <FaTwitter size={20} />
            </a>
            <a href="https://github.com/hanahem" target="_blank">
              <FaGithub size={20} />
            </a>
          </span>
        </span>
      </div> */}
    </div>
  );
};

export default IndexPage;
