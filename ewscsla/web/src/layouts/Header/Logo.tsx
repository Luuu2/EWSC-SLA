import React from "react";
import {cn} from "@/lib/utils";

export default function Logo({className, ...props}: React.HTMLAttributes<HTMLElement>) {
    return (
        <p className={cn("text-3xl font-bold pr-5 border-0 lg:border-r-2 text-lusanda inline-block", className)}>
            EWSC SLA
        </p>
    )
}