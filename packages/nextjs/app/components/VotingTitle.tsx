import {useContext} from "react";
import {TimeLeftToVoteMsContext} from "~~/app/components/Voting";

export function VotingTitle() {
    const timeLeftToVote = useContext(TimeLeftToVoteMsContext);

    const formatTimeLeft = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);

        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    }

    const timeLeftJSX = () => {
         if (timeLeftToVote === 0) {
            return <p className="text-center text-sm text-gray-400 mt-0">Vote has ended</p>
        } else {
            return <p className="text-center text-sm text-gray-400 mt-0">Vote will end in {formatTimeLeft(timeLeftToVote)}</p>
        }
    }

    return <>
        <div>
            <h1 className="font-bold text-center text-xl">The best actor of 2024 vote</h1>
            { timeLeftJSX() }
        </div>
    </>
}
