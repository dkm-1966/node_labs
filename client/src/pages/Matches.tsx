import { FC, useEffect, useState } from "react";
import Header from "../components/Header";
import Couples from "../components/Couples";
import { IUser } from "../interfaces/IUser";

const Matches: FC = () => {
    const [couples, setCouples] = useState<IUser[]>();

    useEffect(() => {
        const id = sessionStorage.getItem("userId")
        fetch(`http://localhost:5001/api/v1/matches?id=${id}`, {
            headers: {
                "Content-type": "application/json"
            }
        }).then (async (res) => {
            const data = await res.json();
            console.log("matches in couples component (matches page)", data)
            setCouples(data)
        })
    }, [])

    return (
        <div className="min-h-screen bg-lime-100 flex flex-col items-center py-16 gap-8">
            <Header />
            <Couples couples={couples} title="Here is your love"/>
        </div>
    )
}

export default Matches