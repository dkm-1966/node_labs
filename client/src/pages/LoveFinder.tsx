import { FC, useState, useEffect } from "react";
import Feed from "../components/Feed";
import Header from "../components/Header";
import Couples from "../components/Couples";
import { IUser } from "../interfaces/IUser";

const LoveFinder: FC = () => {

  const [couples, setCouples] = useState<IUser[]>();
  
  useEffect(() => {
    const id = sessionStorage.getItem("userId")
    fetch(`http://localhost:5001/api/v1/matches/likes?id=${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      const data = await res.json();
      console.log("matches in couples component (loveFinder page)", data);
      setCouples(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-lime-100 flex flex-col items-center py-16 gap-8">
      <Header />
      <Couples couples={couples} setCouples={setCouples} title="Hey, they are waiting for your reply" page="loveFinder"/>
      <Feed />
    </div>
  );
};

export default LoveFinder;
