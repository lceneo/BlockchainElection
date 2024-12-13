"use client";

import type { NextPage } from "next";
import Voting from "~~/app/components/Voting";

const Home: NextPage = () => {
  return (
      <div className="pt-4">
        <Voting/>
      </div>
  );
};

export default Home;
