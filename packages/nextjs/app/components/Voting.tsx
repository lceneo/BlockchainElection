import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { toBytes } from "viem";
import Candidates, {ICandidate} from "~~/app/components/Candidates";
import {ResultsPie} from "~~/app/components/ResultsPie";
import {sumBy} from "lodash";
import LoadingSpinner from "~~/components/LoadingSpinner";
import CandidateSelectionList from "~~/app/components/CandidateSelectionList";
import {VotingTitle} from "~~/app/components/VotingTitle";
import {createContext, useState} from "react";

export const TimeLeftToVoteMsContext = createContext(0);

export default function Voting() {
    const [timeLeftToVote, setTimeLeftToVote] = useState(0);

    const { data: proposalsData, isSuccess: isLoaded} = useScaffoldReadContract({
        contractName: "YourContract",
        functionName: "getProposals",
    });

    const { data: votingStartTimestampInSeconds } = useScaffoldReadContract({
        contractName: 'YourContract',
        functionName: 'creationTimestamp'
    });

    const { isSuccess: voteIsEndedFetched } = useScaffoldReadContract({
        contractName: 'YourContract',
        functionName: 'voteEnded'
    });

    const { data: votingDurationInSeconds } = useScaffoldReadContract({
        contractName: 'YourContract',
        functionName: 'VOTE_DURATION'
    });

    if (voteIsEndedFetched && votingStartTimestampInSeconds && votingDurationInSeconds) {
        const votingEndTimestampInMs = Number(votingStartTimestampInSeconds + votingDurationInSeconds) * 1000;
        const updateInterval = setInterval(() => {
            const currentTimeLeft = votingEndTimestampInMs - new Date().getTime();
            setTimeLeftToVote(currentTimeLeft);
            if (currentTimeLeft <= 0) {
                clearInterval(updateInterval);
                setTimeLeftToVote(0);
            }
        }, 1000)
    }

    const voteIsEnded = timeLeftToVote === 0 && voteIsEndedFetched && votingStartTimestampInSeconds && votingDurationInSeconds;

    let formattedCandidates: ICandidate[] = [];

    if (isLoaded) {
        formattedCandidates = proposalsData!
            .map((data, i) => ({
                id: Number(data.id),
                voteCount: Number(data.voteCount),
                name: new TextDecoder().decode(toBytes(data.name)).replaceAll('\u0000', ''),
                color: i === 0 ? 'red' : 'blue'
            }))
    }

    return <>
        {isLoaded ?
            (
                <TimeLeftToVoteMsContext.Provider value={timeLeftToVote}>
                    <div className="flex flex-col gap-3">
                        <VotingTitle/>
                        <Candidates candidates={formattedCandidates}/>
                        {sumBy(formattedCandidates, 'voteCount') > 0 ? <ResultsPie candidates={formattedCandidates}/> :
                            <h2 className="text-center font-bold text-2xl">No votes has been made yet!</h2>}
                        { voteIsEnded && voteIsEndedFetched ? <></> : <CandidateSelectionList candidates={formattedCandidates}  />}
                    </div>
                </TimeLeftToVoteMsContext.Provider>
            ) :
            <LoadingSpinner/>
        }
    </>
}

