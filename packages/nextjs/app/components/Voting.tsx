import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { toBytes } from "viem";
import Candidates, {ICandidate} from "~~/app/components/Candidates";
import {ResultsPie} from "~~/app/components/ResultsPie";
import {sumBy} from "lodash";
import LoadingSpinner from "~~/components/LoadingSpinner";
import CandidateSelectionList from "~~/app/components/CandidateSelectionList";
import {VotingTitle} from "~~/app/components/VotingTitle";

export default function Voting() {
    const {data: proposalsData, isSuccess: isLoaded} = useScaffoldReadContract({
        contractName: "YourContract",
        functionName: "getProposals",
    });

    const { data: voteIsEnded, isSuccess: voteIsEndedFetched } = useScaffoldReadContract({
        contractName: 'YourContract',
        functionName: 'voteEnded'
    });

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
                <div className="flex flex-col gap-3">
                    <VotingTitle/>
                    <Candidates candidates={formattedCandidates}/>
                    {sumBy(formattedCandidates, 'voteCount') > 0 ? <ResultsPie candidates={formattedCandidates}/> :
                        <h2 className="text-center font-bold text-2xl">No votes has been made yet!</h2>}
                    { voteIsEnded && voteIsEndedFetched ? <></> : <CandidateSelectionList candidates={formattedCandidates}  />}
                </div>
            ) :
            <LoadingSpinner/>
        }
    </>
}

