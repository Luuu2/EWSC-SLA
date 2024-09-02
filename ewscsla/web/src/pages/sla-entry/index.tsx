import {Button} from "@/components/ui/button";
import {File} from "lucide-react";
import AddSlaEntryDialog from "@/pages/sla-entry/include/AddSlaEntryDialog";
import {useEffect, useState} from "react";
import {Department, SlaEntry} from "@/types/types";
import axios from "axios";
import {
    API_GET_DEPARTMENTS_URL,
    API_GET_SLA_ENTRIES_BY_DEPARTMENT_URL,
    API_SLA_GENERATE_SLA_ENTRIES_REPORT_URL
} from "@/app/config";
import {toast} from "@/components/ui/use-toast";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import SlaEntriesTab from "@/pages/sla-entry/tabs/sla-entries-tab";
import YourSlaRatingsTab from "@/pages/sla-entry/tabs/your-sla-ratings-tab";

export const searchSlasFormSchema = z.object({
    department: z.string({
        required_error: "Department is required."
    }).min(1),
})


export default function SlaEntryPage() {

    const [departments, setDepartments] = useState<Department[]>([])
    useEffect(() => {
        axios.get(API_GET_DEPARTMENTS_URL,)
            .then((response) => {
                setDepartments(response.data || [])
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "Failed to load departments. There was a problem with your request. ",
                })
            });
    }, [])

    const [slaEntries, setSlaEntries] = useState<SlaEntry[]>([]);
    const searchSlasForm = useForm<z.infer<typeof searchSlasFormSchema>>({
        resolver: zodResolver(searchSlasFormSchema),
        defaultValues: {
            department: ''
        },
    });

    async function onSearchSlaEntries(values: z.infer<typeof searchSlasFormSchema>) {
        await axios.get(API_GET_SLA_ENTRIES_BY_DEPARTMENT_URL, {
            params: {
                'department': values.department
            }
        }).then((response) => {
            setSlaEntries(response.data || [])
            toast({
                variant: "success",
                title: "Request successful.",
                description: "SLA Entries for selected department updated successfully.",
            })
        }).catch((error) => {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Failed to load SLA Entries. There was a problem with your request. ",
            })
        });
    }

    return (
        <div>
            <Tabs defaultValue="sla-entries">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="sla-entries">SLA Entries</TabsTrigger>
                        <TabsTrigger value="sla-ratings">Your SLA Ratings</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-7 gap-1">
                            <File className="h-3.5 w-3.5"/>
                            <a href={API_SLA_GENERATE_SLA_ENTRIES_REPORT_URL} target="_blank" download className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Export
                            </a>
                        </Button>
                        <AddSlaEntryDialog departments={departments}/>
                    </div>
                </div>

                <TabsContent value="sla-entries">
                    <SlaEntriesTab
                        slaEntries={slaEntries}
                        searchSlasForm={searchSlasForm}
                        onSearchSlaEntries={onSearchSlaEntries}
                        departments={departments}/>
                </TabsContent>

                <TabsContent value="sla-ratings">
                    <YourSlaRatingsTab
                        searchSlasForm={searchSlasForm}
                        departments={departments}/>
                </TabsContent>

            </Tabs>


        </div>
    )
}