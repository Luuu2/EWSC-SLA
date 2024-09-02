import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {LoadingButton} from "@/components/ui/loadingButton";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import {z} from "zod";
import {useEffect, useState} from "react";
import {Department, SlaRatingEntry} from "@/types/types";
import axios from "axios";
import {
    API_GET_DEPARTMENTS_URL,
    API_SLA_RATING_ENTRIES_FOR_DEPARTMENT_URL
} from "@/app/config";
import {toast} from "@/components/ui/use-toast";
import {searchSlasFormSchema} from "@/pages/sla-entry";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RatingBadge} from "@/pages/sla-entry/tabs/your-sla-ratings-tab";
import ViewImprovementActionPlanDialog from "@/pages/improvement-action-plan/include/ViewImprovementActionPlanDialog";
import ImprovementActionPlanDialog from "@/pages/improvement-action-plan/include/ImprovementActionPlanDialog";

export default function ImprovementActionPlan() {
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

    const searchSlaRatingsForm = useForm<z.infer<typeof searchSlasFormSchema>>({
        resolver: zodResolver(searchSlasFormSchema),
        defaultValues: {
            department: ''
        },
    });

    const [slaRatingEntries, setSlaRatingEntries] = useState<SlaRatingEntry[]>([]);

    async function onSearchSlaRatingEntries(values: z.infer<typeof searchSlasFormSchema>) {
        await axios.get(API_SLA_RATING_ENTRIES_FOR_DEPARTMENT_URL, {
            params: {
                'department': values.department
            }
        }).then((response) => {
            setSlaRatingEntries(response.data || [])
            toast({
                variant: "success",
                title: "Request successful.",
                description: "SLA Entry Ratings for selected department updated successfully.",
            })
        }).catch((error) => {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Failed to load SLA Entry Ratings. There was a problem with your request. ",
            })
        });
    }


    return (
        <Card className="min-h-[300px] mb-5">

            <CardHeader className="flex flex-col md:flex-row justify-between md:items-center px-7">
                <div className={"flex-1 grid gap-2"}>
                    <CardTitle className={"text-3xl font-semibold tracking-tight"}>
                        Improvement Action Plan Entry
                    </CardTitle>
                    <CardDescription>
                        Browse, add and modify improvement action plan for each SLA rating.
                    </CardDescription>
                </div>

                <Form {...searchSlaRatingsForm}>
                    <form onSubmit={searchSlaRatingsForm.handleSubmit(onSearchSlaRatingEntries)}
                          className={"flex flex-col md:flex-row gap-2"}>

                        <FormField
                            control={searchSlaRatingsForm.control}
                            name="department"
                            render={({field}) => (
                                <FormItem className={"min-w-[200px]"}>
                                    <FormLabel htmlFor={"role"}>Department</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    departments.map((department, index) => (
                                                        <SelectItem
                                                            key={index}
                                                            value={`${department.id}`}
                                                        >{department.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>

                        <LoadingButton
                            loading={searchSlaRatingsForm.formState.isSubmitting}
                            size={"default"}
                            className={"md:mt-8"} type={"submit"}
                        >Load SLA Ratings</LoadingButton>
                    </form>
                </Form>

            </CardHeader>
            <CardContent>
                <Table>

                    <TableHeader>
                        <TableRow>
                            <TableHead className={"border-x border-t w-[25%]"}>SLA</TableHead>
                            <TableHead className="border-x border-t w-[10%]">Department</TableHead>
                            <TableHead className="border-x border-t lg:w-[10%]">Rating</TableHead>
                            <TableHead className="border-x border-t w-[25%]">Reason</TableHead>
                            <TableHead className="border-x border-t w-[20%]">
                                Improvement Plan
                            </TableHead>
                            <TableHead className="border-x border-t w-[10%]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>


                    <TableBody>

                        {
                            Array.isArray(slaRatingEntries) && slaRatingEntries.length >= 1
                                ? slaRatingEntries.map((rating, index) => (
                                    <TableRow key={index} className={cn(index % 2 === 0 && "bg-accent")}>
                                        <TableCell
                                            className={"border-x align-top"}>{rating?.sla?.service_description}</TableCell>
                                        <TableCell className="align-top">
                                            <Badge className="text-xs" variant="outline">
                                                {rating?.sla?.department?.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="border-x align-top">
                                            <RatingBadge rating={rating.rating}/>
                                        </TableCell>
                                        <TableCell className="border-x align-top">
                                            {rating.reason || "N/A"}
                                        </TableCell>
                                        <TableCell className={"border-x align-top"}>
                                            {rating.improvement_action_plan?.improvement_action || "N/A"}
                                        </TableCell>
                                        <TableCell className={"border-x align-top"}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        aria-haspopup="true"
                                                        size="icon"
                                                        variant="ghost"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4"/>
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    {
                                                        rating.improvement_action_plan?.improvement_action
                                                            ? <>
                                                                <ViewImprovementActionPlanDialog sla_rating={rating}/>
                                                                <ImprovementActionPlanDialog sla_rating={rating} isEdit={true}/>
                                                                <DropdownMenuItem onClick={() => {
                                                                    toast({
                                                                        title: "Coming soon.",
                                                                        description: "Not yet implemented. Coming soon."
                                                                    })
                                                                }}>
                                                                    Delete Improvement Action Plan
                                                                </DropdownMenuItem>
                                                            </>
                                                            : <>
                                                                <ImprovementActionPlanDialog sla_rating={rating}/>
                                                            </>
                                                    }
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : <TableRow className="bg-accent">
                                    <TableCell colSpan={7} className={"border-x text-center"}>
                                        <div className="text-muted-foreground">
                                            No Data. No SLA Ratings.
                                        </div>
                                    </TableCell>
                                </TableRow>
                        }

                    </TableBody>


                </Table>
            </CardContent>
        </Card>
    )
}