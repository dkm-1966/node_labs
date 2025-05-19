import React, { FC, useEffect, useState } from "react";
import ProfileShortCard from "./ProfileShortCard";
import OutlinedButton from "../UI/OutlinedButton";

interface Profile {
  id: number;
  name: string;
  age: number;
  city: string;
  country: string;
  interests: string[];
  picture_url: string
}

const Feed: FC = () => {
  const [offset, setOffset] = useState<number>(0);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  let isPrevBtnDisabled = offset <= 0;
  let isNextBtnDisabled = profiles.length < 5 || profiles.length === 0; 

  useEffect(() => {
    const interests: string[] = ["Football"];
    const query = new URLSearchParams();
    interests.forEach((i) => query.append("interest", i));

    const current_user_id = sessionStorage.getItem("userId");
    console.log(current_user_id);

    fetch(
      `http://localhost:5001/api/v1/profiles?limit=5&offset=${offset}&id=${current_user_id}&${query.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(async (res) => {
      const data = await res.json();
      setProfiles(data);
    });
  }, [offset]);
  
  const handleNextPage = () => {
    if (!isNextBtnDisabled){
      setOffset((prev) => prev + 5)
    }
  }

  const handlePrevPage = () => {
    if(!isPrevBtnDisabled) {
      setOffset((prev) => prev - 5)
    }
  }

  const handleSetNewLike = (partnerId: number) => {
    const currentUserId = sessionStorage.getItem("userId")

    console.log("function triggered")
        
    fetch(`http://localhost:5001/api/v1/matches/likes?id=${currentUserId}&partnerId=${partnerId}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      }
    }).then(() => {
      setProfiles((prev) => prev.filter((profile) => profile.id !== partnerId))
    }).catch((error) => {
      console.log("Error setting new like from feed", error)
    })
  }


  console.log("profiles", profiles);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-2xl text-lime-600 font-extrabold">Here is your possible love</h2>
        <p className="flex flex-row items-center gap-4 mr-4">
          <OutlinedButton callback={handlePrevPage} isDisabled={isPrevBtnDisabled}>Previous</OutlinedButton>
          <OutlinedButton callback={handleNextPage} isDisabled={isNextBtnDisabled}>Next</OutlinedButton>
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 w-216 p-4 bg-lime-600 rounded-3xl">
      {profiles?.map((profile) => (
          <ProfileShortCard key={profile.id} {...profile} callback={handleSetNewLike} page="loveFinder"/>
      ))}
      </div>
    </div>
  )
};

export default Feed;
