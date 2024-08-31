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
import {Department, SlaRatingEntry} from "@/types/types";
import {z} from "zod";
import axios from "axios";
import {API_GET_SLA_ENTRY_RATINGS_FOR_USER_URL} from "@/app/config";
import {useState} from "react";
import {toast} from "@/components/ui/use-toast";
import {searchSlasFormSchema} from "@/pages/sla-entry";

type RatingBadgeProps = {
    rating: string;
}

function RatingBadge({rating}: RatingBadgeProps) {
    switch (rating) {
        case "1.00":
            return (
                <Badge variant="destructive">Poor</Badge>
            )
        case "2.00":
            return (
                <Badge
                    className={"border-transparent bg-orange-500 text-slate-50 shadow hover:bg-orange-500/80 dark:bg-orange-900 dark:text-slate-50 dark:hover:bg-orange-900/80"}>
                    Fair
                </Badge>
            )
        case "3.00":
            return (
                <Badge
                    className={"border-transparent bg-yellow-500 text-slate-50 shadow hover:bg-yellow-500/80 dark:bg-yellow-900 dark:text-slate-50 dark:hover:bg-yellow-900/80"}>
                    Good
                </Badge>
            )
        case "4.00":
            return (
                <Badge
                    className={"border-transparent bg-blue-500 text-slate-50 shadow hover:bg-blue-500/80 dark:bg-blue-900 dark:text-slate-50 dark:hover:bg-blue-900/80"}>
                    Very Good
                </Badge>
            )
        case "5.00":
            return (
                <Badge
                    className={"border-transparent bg-green-500 text-slate-50 shadow hover:bg-green-500/80 dark:bg-green-900 dark:text-slate-50 dark:hover:bg-green-900/80"}>
                    Excellent
                </Badge>
            )
        default:
            return (
                <Badge variant={"default"}>Unknown</Badge>
            )
    }
}


type YourSlaRatingsTabProps = {
    searchSlasForm: any;
    departments: Department[];
}

export default function YourSlaRatingsTab(
    {searchSlasForm, departments}: YourSlaRatingsTabProps
) {

    const [slaRatingEntries, setSlaRatingEntries] = useState<SlaRatingEntry[]>([]);

    async function onSearchSlaEntryRatings(values: z.infer<typeof searchSlasFormSchema>) {
        await axios.get(API_GET_SLA_ENTRY_RATINGS_FOR_USER_URL, {
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
                        Your Previous SLA Entry Ratings
                    </CardTitle>
                    <CardDescription className={"max-w-lg"}>
                        Browse, add and modify your previous SLA entry ratings for each department.
                        You can update your customer status on entries with proposed SLA improvement action plans.
                    </CardDescription>
                </div>

                <Form {...searchSlasForm}>
                    <form onSubmit={searchSlasForm.handleSubmit(onSearchSlaEntryRatings)}
                          className={"flex flex-col md:flex-row gap-2"}>

                        <FormField
                            control={searchSlasForm.control}
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
                            loading={searchSlasForm.formState.isSubmitting}
                            size={"default"}
                            className={"md:mt-8"} type={"submit"}
                        >Search SLA Ratings</LoadingButton>
                    </form>
                </Form>

            </CardHeader>
            <CardContent>
                <Table>

                    <TableHeader>
                        <TableRow>
                            <TableHead>SLA</TableHead>
                            <TableHead className="hidden sm:table-cell">Department</TableHead>
                            <TableHead className="hidden sm:table-cell">Rating</TableHead>
                            <TableHead className="hidden md:table-cell">Reason</TableHead>
                            <TableHead className="hidden md:table-cell">Improvement Plan</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>


                    <TableBody>

                        {
                            Array.isArray(slaRatingEntries) && slaRatingEntries.length >= 1
                                ? slaRatingEntries.map((rating, index) => (
                                    <TableRow key={index} className={cn(index % 2 === 0 && "bg-accent")}>
                                        <TableCell className={"align-top"}>{rating?.sla?.service_description}</TableCell>
                                        <TableCell className="hidden sm:table-cell align-top">
                                            <Badge className="text-xs text-center" variant="outline">
                                                {rating?.sla?.department?.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell align-top">
                                            <RatingBadge rating={rating.rating}/>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell align-top">
                                            {rating.reason || "N/A"}
                                        </TableCell>
                                        <TableCell style={{textWrap: 'nowrap'}} className={"align-top"}>
                                            {"N/A"}
                                        </TableCell>
                                        <TableCell className={"align-top"}>
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
                                                    <DropdownMenuItem>Set Customer Status</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit SLA Rating</DropdownMenuItem>
                                                    <DropdownMenuItem>Delete SLA Rating</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : <TableRow className="bg-accent">
                                    <TableCell colSpan={7} className={"text-center"}>
                                        <div className="text-muted-foreground">
                                            No Data. You have not Rated any SLAs.
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