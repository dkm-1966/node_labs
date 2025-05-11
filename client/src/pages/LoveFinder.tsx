import { FC } from "react";
import Feed from "../components/Feed";
import Header from "../components/Header";
import Couples from "../components/Couples";

const LoveFinder: FC = () => {
  return (
    <div className="min-h-screen bg-lime-100 flex flex-col items-center py-16 gap-8">
      <Header />
      <Couples />
      <Feed />
    </div>
  );
};

export default LoveFinder;
