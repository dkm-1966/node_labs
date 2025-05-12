import { FC, useEffect, useState } from "react";
import img from "../assets/default-profile-img.jpg";
import Tag from "../UI/Tag";
import { Modal } from "antd"
import OutlinedButton from "../UI/OutlinedButton.tsx"

interface ProfileShortCardProps {
  id: number;
  name: string | null;
  picture_url: string | null;
  country: string | null;
  city: string | null;
  info: string,
  interests: any[] | null;
  page: string | undefined;
  callback: (id: number) => void;
}

const ProfileShortCard: FC<ProfileShortCardProps> = ({
  id,
  picture_url,
  name,
  country,
  city,
  info,
  interests,
  page,
  callback
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <>
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={
        <OutlinedButton callback={() => setIsModalOpen(false)}>OK</OutlinedButton>
      }
      title={<h2 className="text-2xl font-medium text-lime-600">{name}'s private info</h2>}
    >
      <p className="text-xl text-lime-700">{info}</p>
    </Modal>
    <div className="flex flex-row items-center w-full gap-4">
      <div className="flex flex-row justify-between w-full items-center p-4 bg-slate-50 rounded-2xl shadow-lg shadow-lime-400/50 hover:shadow-lime-400 border-t-2 border-green-700/20 hover:border-green-700 transition duration-500">
        <div className="flex flex-row gap-4 items-center justify-center pr-8">
          <img
            src={picture_url || img}
            onClick={() => setIsModalOpen(true)}
            className="w-18 rounded-xl border-2 border-lime-600"
          />
          <h2 className="text-2xl text-lime-700 font-bold">{name}</h2>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row flex-wrap gap-2 pr-8">
            {interests?.map((i, index) => (
              <Tag key={index}>{i.interest}</Tag>
            ))}
          </div>
          <i className="fa-solid fa-location-dot text-lime-600" />
          {country || city ? (
            <p className="text-lg text-lime-700">
              {country} {city}
            </p>
          ) : (
            <p className="text-lg text-lime-700">No location</p>
          )}
        </div>
      </div>
      {page === 'loveFinder' && <i
        className="fa-solid fa-heart-circle-plus text-3xl text-lime-300 hover:text-rose-600 transition duration-500"
        onClick={() => callback(id)}
      />}
    </div>
    </>
  );
};

export default ProfileShortCard;
