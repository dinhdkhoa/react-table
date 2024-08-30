'use client'

import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { convertToEnodeLogBarChartDateInteractiveEntityFn, EnodeLogBarChartDateInteractiveEntity, EnodeLogEntity, EnodeLogPaginationEntity } from "@/domain/entities/enode-log/enode-log-entity";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export const EnodeLogChartDateComponent = ({ entity }: { entity: EnodeLogPaginationEntity | undefined }) => {
    const [barChartInteractiveData, setBarChartInteractiveData] = useState<EnodeLogBarChartDateInteractiveEntity[]>();
    const chartConfig = {
        date: {
            label: 'Date'
        },
        count: {
            label: "Count",
            color: "hsl(var(--primary))",
        },

    } satisfies ChartConfig

    useEffect(() => {
        const _result = convertToEnodeLogBarChartDateInteractiveEntityFn({ data: entity?.data || [] });
        setBarChartInteractiveData(_result);
    }, [entity])

    return (
        <Card className="w-full mt-5 rounded-md" >
            <CardContent className="pt-4">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={barChartInteractiveData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                return new Date(value).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                // <ChartTooltipContent/>
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                />
                            }
                        />
                        <Bar dataKey="count" fill={`var(--color-${'count'})`} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>)
}
