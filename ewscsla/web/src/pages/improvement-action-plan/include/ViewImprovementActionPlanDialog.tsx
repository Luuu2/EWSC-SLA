import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {SlaRatingEntry} from "@/types/types";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {format} from "date-fns";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {RatingBadge, StatusBadge} from "@/pages/sla-entry/tabs/your-sla-ratings-tab";


type ViewImprovementActionPlanDialogProps = {
    sla_rating: SlaRatingEntry;
}

export default function ViewImprovementActionPlanDialog({sla_rating}: ViewImprovementActionPlanDialogProps) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View Improvement Action Plan</DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>View Improvement Action Plan</DialogTitle>
                    <DialogDescription>
                        <p className={"font-bold"}>
                            Rating: {sla_rating.rating} <RatingBadge rating={sla_rating.rating}/>
                        </p>
                        <p className={"font-bold"}>Reason: {sla_rating.reason}</p>
                    </DialogDescription>
                </DialogHeader>

                <Table>

                    <TableHeader>
                        <TableRow>
                            <TableHead className={"border-x border-t"}>Due Date</TableHead>
                            <TableHead className="border-x border-t hidden sm:table-cell">
                                Status
                            </TableHead>
                            <TableHead className="border-x border-t hidden sm:table-cell">
                                Improvement Action Plan
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>

                        <TableRow>
                            <TableCell className={"border-x border-b align-top"}>
                                {format(sla_rating.improvement_action_plan?.due_date || new Date(), "yyyy-MM-dd")}
                            </TableCell>
                            <TableCell className={"border-x border-b align-top"}>
                                <StatusBadge status={sla_rating.improvement_action_plan?.status}/>
                            </TableCell>
                            <TableCell
                                className={"border-x border-b align-top"}>{sla_rating.improvement_action_plan?.improvement_action}</TableCell>
                        </TableRow>

                    </TableBody>

                </Table>

            </DialogContent>
        </Dialog>
    )
}