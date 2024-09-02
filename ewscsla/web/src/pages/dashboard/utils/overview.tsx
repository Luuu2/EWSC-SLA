import {Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend} from "recharts"
import {AggregatedRating} from "@/types/types";

export type OverViewProps = {
    aggregated_ratings: AggregatedRating[];
}

export function Overview({aggregated_ratings}: OverViewProps) {

    const data = aggregated_ratings.map((rating) => {
        return {
            name: rating.department,
            ...rating.ratings
        }
    })

    console.log("data", data)

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                />

                <CartesianGrid strokeDasharray="2 2"/>
                <Tooltip/>
                <Legend/>

                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Bar
                    dataKey="poor"
                    fill="#dc2626"
                    stackId="a" radius={[4, 4, 0, 0]}
                />

                <Bar
                    dataKey="fair"
                    fill="#ea580c"
                    stackId="a" radius={[4, 4, 0, 0]}
                />

                <Bar
                    dataKey="good"
                    fill="#16a34a"
                    stackId="a" radius={[4, 4, 0, 0]}
                />

                <Bar
                    dataKey="very_good"
                    fill="#2563eb"
                    stackId="a" radius={[4, 4, 0, 0]}
                />

                <Bar
                    dataKey="excellent"
                    stackId="a"
                    fill="#7c3aed" radius={[4, 4, 0, 0]}
                />

            </BarChart>
        </ResponsiveContainer>
    )
}
