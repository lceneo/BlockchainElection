import {ICandidate} from "~~/app/components/Candidates";
import {AgChartProps, AgCharts} from "ag-charts-react";
import {max, maxBy, sumBy} from "lodash";

export function ResultsPie({ candidates }: ResultsPieComponentProps) {

    const colorsDictionary: Record<string, string> = {
        red: 'text-red-600',
        blue: 'text-blue-600'
    };

    const allVotesCount = sumBy(candidates, 'voteCount');

    const formattedCandidates: IPieCandidates[] = candidates
        .map((c, i) => ({
            ...c,
            votePercentage: (c.voteCount / allVotesCount) * 100
        }));

    const maxVotesCount = max(formattedCandidates.map(c => c.voteCount));
    const leadingCandidates = formattedCandidates.filter(c => c.voteCount === maxVotesCount);

    const pieOptions: AgChartProps['options'] = {
        data: formattedCandidates,
        series: [{
            type: 'pie',
            angleKey: 'voteCount',
            calloutLabelKey: 'name',
            sectorLabelKey: 'voteCount',
            shadow: {
                enabled: true
            },
            sectorLabel: {
                fontWeight : 'bold',
            },
            calloutLabel: {
                fontWeight: 'bold',
                offset: 20,
                fontSize: 14,
            },
            tooltip: {
                renderer: params => {
                    return `${params.datum.voteCount} (${params.datum.votePercentage.toFixed(2)}%)`;
                }
            },
            fills: candidates.map(c => c.color)}],
        background: {
            fill: 'transparent'
        }
    }


    return (<>
        {leadingCandidates.length === 1 ?
            <h2 className="font-bold text-3xl text-center"><span
                className={colorsDictionary[leadingCandidates[0].color]}>{leadingCandidates[0].name}</span> is leading the
                vote!</h2> :
            <h2 className="font-bold text-3xl text-center">No one is leading the vote!</h2>
        }
        <AgCharts options={pieOptions}/>
    </>)
}

type IPieCandidates = ICandidate & { votePercentage: number };

type ResultsPieComponentProps = {
    candidates: ICandidate[]
}

