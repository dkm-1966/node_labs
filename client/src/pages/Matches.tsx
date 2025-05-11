import { FC } from "react";
import Header from "../components/Header";
import Couples from "../components/Couples";

const Matches: FC = () => {
    return (
        <div className="min-h-screen bg-lime-100 flex flex-col items-center py-16 gap-8">
            <Header />
            <Couples />
        </div>
    )
}

export default Matches