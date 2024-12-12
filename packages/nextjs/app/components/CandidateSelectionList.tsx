import {ICandidate} from "~~/app/components/Candidates";
import {ChangeEvent, useState} from "react";
import {useScaffoldWriteContract} from "~~/hooks/scaffold-eth";

export default function CandidateSelectionList({ candidates }: CandidateSelectionListComponentProps) {
    const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract('YourContract');
    const [selectedCandidate, setSelectedCandidate] = useState(0);
    const [hasVoted, setHasVoted] = useState(false);

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
        <h2 className="font-bold">Make your choice!</h2>
        <ul>
            {candidates.map(candidate => (
                <li key={candidate.id} className="m-1">
                    <input className="radio-sm align-sub" name="candidate" value={candidate.id} type='radio'
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
