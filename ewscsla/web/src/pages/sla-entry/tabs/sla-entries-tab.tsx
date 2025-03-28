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
import {Department, SlaEntry} from "@/types/types";
import AddSlaRatingEntryDialog from "@/pages/sla-entry/include/AddSlaRatingEntryDialog";
import EditSlaEntryDialog from "@/pages/sla-entry/include/EditSlaEntryDialog";
import {SelectGroup} from "@radix-ui/react-select";
import LineClampWithDialog from "@/components/LineClampWithDialog";


type SlaEntriesTabProps = {
    searchSlasForm: any;
    onSearchSlaEntries: any;
    departments: Department[];
    slaEntries: SlaEntry[];
}

export default function SlaEntriesTab(
    {searchSlasForm, onSearchSlaEntries, departments, slaEntries}: SlaEntriesTabProps
) {
    return (
        <Card className="min-h-[300px] mb-5">
            <CardHeader className="flex flex-col md:flex-row justify-between md:items-center px-7">
                <div className={"flex-1 grid gap-2"}>
                    <CardTitle className={"text-3xl font-semibold tracking-tight"}>SLA Entries</CardTitle>
                    <CardDescription>Browse, add and modify SLA entries for each department.</CardDescription>
                </div>

                <Form {...searchSlasForm}>
                    <form onSubmit={searchSlasForm.handleSubmit(onSearchSlaEntries)}
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
                                                <SelectGroup className="overflow-y-auto max-h-[15rem]">
                                                    {
                                                        departments.map((department, index) => (
                                                            <SelectItem
                                                                key={index}
                                                                value={`${department.id}`}
                                                            >{department.name}</SelectItem>
                                                        ))
                                                    }
                                                </SelectGroup>
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
                        >Search SLA Entries</LoadingButton>
                    </form>
                </Form>

            </CardHeader>
            <CardContent>
                <Table>

                    <TableHeader>
                        <TableRow>
                            <TableHead className="border-x border-t sm:w-[19%]">Key Performance Area</TableHead>
                            <TableHead className="border-x border-t sm:w-[17%]">Ser. Provider Responsibility</TableHead>
                            <TableHead className="border-x border-t hidden sm:table-cell sm:w-[17%]">Customer
                                Responsibility</TableHead>
                            <TableHead className="border-x border-t hidden sm:table-cell sm:w-[17%]">Service
                                Level</TableHead>
                            <TableHead
                                className="border-x border-t hidden md:table-cell md:w-[7%]">Department</TableHead>
                            <TableHead className="border-x border-t hidden md:table-cell md:w-7%]">Added By</TableHead>
                            <TableHead className="border-x border-t md:w-[8%]">Date</TableHead>
                            <TableHead className="border-x border-t md:w-[8%]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>


                    <TableBody>

                        {
                            Array.isArray(slaEntries) && slaEntries.length >= 1
                                ? slaEntries.map((entry, index) => (
                                    <TableRow key={index} className={cn(index % 2 === 0 && "bg-accent")}>
                                        <TableCell
                                            className={"border-x align-top whitespace-pre-line"}>{entry.key_performance_area}</TableCell>
                                        <TableCell className="border-x hidden sm:table-cell align-top whitespace-pre-line">
                                            <LineClampWithDialog title="Service Provider Responsibility" content={entry.service_provider_responsibility} />
                                        </TableCell>
                                        <TableCell
                                            className="border-x hidden sm:table-cell align-top whitespace-pre-line">
                                            <LineClampWithDialog title="Customer Responsibility" content={entry.customer_responsibility} />
                                        </TableCell>
                                        <TableCell className="border-x hidden sm:table-cell align-top whitespace-pre-line">
                                            <LineClampWithDialog title="Service Level" content={entry.service_level} />
                                        </TableCell>
                                        <TableCell className="border-x hidden md:table-cell text-nowrap align-top">
                                            <Badge className="text-xs text-center" variant="outline">
                                                {entry.department.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="border-x hidden md:table-cell align-top">
                                            {entry.added_by || "N/A"}
                                        </TableCell>
                                        <TableCell style={{textWrap: 'nowrap'}} className={"border-x align-top"}>
                                            {entry.date}
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
                                                    <AddSlaRatingEntryDialog sla={entry}/>
                                                    {
                                                        entry.is_author
                                                            ? <EditSlaEntryDialog departments={departments} sla={entry}/>
                                                            : (
                                                                <DropdownMenuItem disabled={true}>
                                                                    Edit SLA Entry
                                                                </DropdownMenuItem>
                                                            )
                                                    }
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : <TableRow className="bg-accent">
                                    <TableCell colSpan={8} className={"border-x text-center"}>
                                        <div className="text-muted-foreground">
                                            No Data. No SLA entries for selected department.
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