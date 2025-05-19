import { FC, useEffect, useState } from "react";
import { IUser } from "../interfaces/IUser";
import ProfileShortCard from "./ProfileShortCard";

interface CouplesProps {
  couples: IUser[] | undefined,
  title: string,
  page: string,
  setCouples: React.Dispatch<React.SetStateAction<IUser[] | undefined>>
}

const Couples: FC<CouplesProps> = ({couples, title, page, setCouples}) => {
  const handleUpdateMatch = (partnerId: number) => {
    const currentUserId = sessionStorage.getItem("userId")

    fetch(`http://localhost:5001/api/v1/matches/likes?id=${currentUserId}&partnerId=${partnerId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json"
      }
    }).then(() => {
      setCouples((prev) => prev?.filter((couple) => couple.id !== partnerId));
    }).catch((error) => {
      console.log("Error while updating match status:", error)
    });
  }

  return (
    <>
      {couples && couples.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl text-lime-600 font-extrabold">{title}</h2>
          <div className="flex flex-col items-center justify-center gap-4 w-216 p-4 bg-lime-600 rounded-3xl">
            {couples?.map((couple) => (
              <ProfileShortCard
                key={couple.id}
                {...couple}
                page={page}
                callback={handleUpdateMatch}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Couples;
