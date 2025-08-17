import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {Overview} from "./utils/overview"
import {Departments} from "./utils/departments"
import {useEffect, useState} from "react";
import {DashboardData} from "@/types/types";
import axios from "axios";
import {API_GET_DASHBOARD_DATA_URL} from "@/app/config";
import {toast} from "@/components/ui/use-toast";


export default function DashboardPage() {

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

    useEffect(() => {
        axios.get(API_GET_DASHBOARD_DATA_URL)
            .then((response) => {
                setDashboardData(response.data || [])
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "Failed to load dashboard data. Try again.",
                })
            });
    }, [])


    return (
        <div className="flex flex-col">

            <div className="flex-1 space-y-4 p-8 pt-6">

                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Eswatini Water Services Corporation SLA System
                    </h2>
                </div>


                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="analytics" disabled>
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="reports" disabled>
                            Reports
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Users
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{dashboardData?.users || "--"}</div>
                                    {/* <p className="text-xs text-muted-foreground">
                                        +20.1% from last month
                                    </p> */}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        SLA Entries
                                    </CardTitle>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none"
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round"
                                         className="h-4 w-4 text-muted-foreground">
                                        <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"></path>
                                        <path d="M2 6h4"></path>
                                        <path d="M2 10h4"></path>
                                        <path d="M2 14h4"></path>
                                        <path d="M2 18h4"></path>
                                        <path
                                            d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"></path>
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{dashboardData?.sla_entries || "--"}</div>
                                    {/* <p className="text-xs text-muted-foreground">
                                        +180.1% from last month
                                    </p> */}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">SLA Ratings</CardTitle>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none"
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round"
                                         className="h-4 w-4 text-muted-foreground">
                                        <path d="m9 12 2 2 4-4"></path>
                                        <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"></path>
                                        <path d="M22 19H2"></path>
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{dashboardData?.ratings || "--"}</div>
                                    {/* <p className="text-xs text-muted-foreground">
                                        +19% from last month
                                    </p> */}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Action Plans
                                    </CardTitle>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
                                        <path
                                            d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
                                        <path d="M8 10v4"/>
                                        <path d="M12 10v2"/>
                                        <path d="M16 10v6"/>
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{dashboardData?.action_plans || "--"}</div>
                                    {/* <p className="text-xs text-muted-foreground">
                                        +201 since last hour
                                    </p> */}
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <Overview aggregated_ratings={dashboardData?.aggregated_ratings || []}/>
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Company Departments</CardTitle>
                                    <CardDescription>
                                        Departments in your organization
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Departments department_data={dashboardData?.department_data || []}/>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    )
}
