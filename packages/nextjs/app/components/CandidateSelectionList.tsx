import {ICandidate} from "~~/app/components/Candidates";
import {ChangeEvent, useState} from "react";
import {useScaffoldReadContract, useScaffoldWriteContract} from "~~/hooks/scaffold-eth";
import {useAccount} from "wagmi";
import LoadingSpinner from "~~/components/LoadingSpinner";

export default function CandidateSelectionList({ candidates }: CandidateSelectionListComponentProps) {
    const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract('YourContract');
    const { address: connectedAddress } = useAccount();

    const { data, isLoading: voteInfoIsLoading, error } = useScaffoldReadContract({
            contractName: "YourContract",
            functionName: "voters",
            args: [connectedAddress],
        });
    const [voteWeightContract, hasVoted, delegateAddress, votedForCandidateIdContract] = data ?? [];
    const voteWeight = voteWeightContract !== undefined ? Number(voteWeightContract) : undefined;
    const votedForCandidateId = votedForCandidateIdContract !== undefined ? Number(votedForCandidateIdContract) : undefined;

    const [selectedCandidate, setSelectedCandidate] = useState(0);
    if (!connectedAddress) {
      return <h2 className="font-bold text-center">You need to login in order to vote</h2>
    } else if (voteInfoIsLoading) {
        return <LoadingSpinner/>;
    }

    const handleCandidateSelection = (e: ChangeEvent<{value: string}>) => {
        setSelectedCandidate(+e.target.value);
    };

    const handleVoteClick =  async () => {
        try {
            await writeYourContractAsync({
                functionName: "vote",
                args: [BigInt(+selectedCandidate)]
            });
        } catch (e) {
            console.error("Error while trying to vote", e);
        }
    }

    return <section className="flex shadow drop-shadow-xl flex-col bg-slate-50 p-3.5 w-1/2 m-auto rounded-2xl">
        <h2 className="font-bold">{!hasVoted ? 'Make your choice!' : 'You have already voted!'}</h2>
        <ul>
            {candidates.map(candidate => (
                <li key={candidate.id} className="m-1">
                    <input disabled={hasVoted} className="radio-sm align-sub" name="candidate" value={candidate.id} type='radio' checked={votedForCandidateId ? votedForCandidateId === candidate.id : undefined}
                           onChange={handleCandidateSelection}
                    />
                    <label className="m-3 text-xl">{candidate.name}</label>
                </li>
            ))}
        </ul>
        <button disabled={hasVoted || !selectedCandidate} className="btn text-white bg-blue-700 self-center btn-md text-sm"
                onClick={handleVoteClick}
        >Vote</button>
    </section>
}

type CandidateSelectionListComponentProps = {
    candidates: ICandidate[];
}
