import {useScaffoldReadContract} from "~~/hooks/scaffold-eth";
import {useState} from "react";

export function VotingTitle() {
    const { data: votingStartTimestampInSeconds } = useScaffoldReadContract({
        contractName: 'YourContract',
        functionName: 'creationTimestamp'
    });

    const { data: votingDurationInSeconds } = useScaffoldReadContract({
        contractName: 'YourContract',
        functionName: 'VOTE_DURATION'
    });

    const { data: voteIsEnded, isSuccess: voteIsEndedFetched } = useScaffoldReadContract({
        contractName: 'YourContract',
        functionName: 'voteEnded'
    });

    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const formatTimeLeft = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);

        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    }

    const timeLeftJSX = () => {
        if (!voteIsEndedFetched || !votingStartTimestampInSeconds || !votingDurationInSeconds) {
            return <></>
        } else if (voteIsEnded || timeLeft === 0) {
            return <p className="text-center text-sm text-gray-400 mt-0">Vote is ended</p>
        } else {
            return <p className="text-center text-sm text-gray-400 mt-0">Vote will end in {formatTimeLeft(timeLeft!)}</p>
        }
    }

    if (voteIsEndedFetched && votingStartTimestampInSeconds && votingDurationInSeconds) {
        const votingEndTimestampInMs = Number(votingStartTimestampInSeconds + votingDurationInSeconds) * 1000;
        const updateInterval = setInterval(() => {
            const currentTimeLeft = votingEndTimestampInMs - new Date().getTime();
            setTimeLeft(currentTimeLeft);
            if (currentTimeLeft <= 0) {
                clearInterval(updateInterval);
                setTimeLeft(0);
            }
        }, 1000)
    }

    return <>
        <div>
            <h1 className="font-bold text-center text-xl">The best actor of 2024 vote</h1>
            { timeLeftJSX() }
        </div>
    </>
}
