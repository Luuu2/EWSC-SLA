import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {
    API_SLA_GENERATE_REPORT_URL
} from "@/app/config";
import {Button} from "@/components/ui/button";
import {Link} from "react-router-dom";

export default function Reports() {
    return (
        <Card className="min-h-[150px]">

            <CardHeader className="flex flex-col md:flex-row justify-between md:items-center px-7">
                <div className={"flex-1 grid gap-2"}>
                    <CardTitle className={"text-3xl font-semibold tracking-tight"}>
                        Generate Consolidated Reports
                    </CardTitle>
                    <CardDescription>
                        Click on the button below to generate consolidated reports in .excel format.
                    </CardDescription>
                </div>


                <Button
                    asChild
                    size={"default"}
                    className={"md:mt-8"}
                >
                    <a href={API_SLA_GENERATE_REPORT_URL} target="_blank" download>Download Report</a>
                </Button>

            </CardHeader>
        </Card>
    )
}