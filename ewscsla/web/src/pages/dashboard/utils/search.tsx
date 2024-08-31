import {Input} from "@/components/ui/input"
import {cn} from "@/lib/utils";
import React from "react";

export function Search({className, ...props}: React.HTMLAttributes<HTMLElement>) {
    return (
        <div>
            <Input
                type="search"
                placeholder="Search department..."
                className={cn("md:w-[100px] lg:w-[300px]", className)}
            />
        </div>
    )
}
