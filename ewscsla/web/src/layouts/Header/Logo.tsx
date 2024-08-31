import React from "react";
import {cn} from "@/lib/utils";

export default function Logo({className, ...props}: React.HTMLAttributes<HTMLElement>) {
    return (
        <p className={cn("text-3xl font-bold pr-5 border-0 lg:border-r-2 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text", className)}>
            EWSC SLA
        </p>
    )
}