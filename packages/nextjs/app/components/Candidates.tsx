import Image from "next/image";

export default function Candidates({ candidates }: CandidateComponentProps) {
    const colorsDictionary: Record<string, string> = {
        red: 'text-red-600',
        blue: 'text-blue-600'
    };

    return (<>
            <section className="flex gap-3 content-stretch justify-center">
                {
                    candidates
                        .map((candidate, i) => (
                            <div key={candidate.id} className="flex flex-col">
                                <h2 className={`font-bold text-3xl text-center ${colorsDictionary[candidate.color]}`}>{candidate.name}</h2>
                                <Image className="flex-grow" src={`/img/${candidate.name}.jpg`}
                                       width={250}
                                       height={250}
                                       alt={candidate.name}
                                />
                            </div>
                        ))
                }
            </section>
    </>)
}


type CandidateComponentProps = {
    candidates: ICandidate[]
}

export interface ICandidate {
    id: number;
    name: string;
    voteCount: number;
    color: string;
}
