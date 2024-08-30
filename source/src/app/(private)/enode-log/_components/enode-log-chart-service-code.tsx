'use client'

import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { convertToEnodeLogBarChartServiceCodeInteractiveEntityFn, EnodeLogBarChartServiceCodeInteractiveEntity, EnodeLogEntity, EnodeLogPaginationEntity } from "@/domain/entities/enode-log/enode-log-entity";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export const EnodeLogChartServiceCodeComponent = ({ entity }: { entity: EnodeLogPaginationEntity | undefined }) => {
    const [barChartInteractiveData, setBarChartInteractiveData] = useState<EnodeLogBarChartServiceCodeInteractiveEntity[]>();
    const chartConfig = {
        serviceCode: {
            label: 'Service Code'
        },
        count: {
            label: "Count",
            color: "hsl(var(--primary))",
        },

    } satisfies ChartConfig

    useEffect(() => {
        const _result = convertToEnodeLogBarChartServiceCodeInteractiveEntityFn({ data: entity?.data || [] });
        setBarChartInteractiveData(_result);
    }, [entity])

    return (
        <Card className="w-full mt-5 rounded-md shadow-none" >
            <CardContent className="pt-6">
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
                            dataKey="serviceCode"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                        // tickFormatter={(value) => {
                        //     return new Date(value).toLocaleDateString("en-US", {
                        //         month: "short",
                        //         day: "numeric",
                        //     })
                        // }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                // labelFormatter={(value) => {
                                //     return new Date(value).toLocaleDateString("en-US", {
                                //         month: "short",
                                //         day: "numeric",
                                //     })
                                // }}
                                />
                            }
                        />
                        <Bar dataKey="count" fill={`var(--color-${'count'})`} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>)
}
