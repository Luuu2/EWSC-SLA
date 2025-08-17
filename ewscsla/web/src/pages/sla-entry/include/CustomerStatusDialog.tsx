import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {
    API_SLA_CUSTOMER_STATUS_URL,
} from "@/app/config";
import {SlaRatingEntry} from "@/types/types";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "@/components/ui/use-toast";
import {useState} from "react";
import getCookie from "@/lib/csrf";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {format} from "date-fns";
import {RatingBadge, StatusBadge} from "@/pages/sla-entry/tabs/your-sla-ratings-tab";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";


const addCustomerStatusFormSchema = z.object({
    rating: z.number({
        required_error: "SLA Rating field is required."
    }),
    status: z.string({
        required_error: "Manger status is required."
    }).min(1, {
        message: 'Manager status is required.'
    })
})

type AddCustomerStatusDialogProps = {
    sla_rating: SlaRatingEntry;
    isEdit?: boolean;
}


export default function CustomerStatusDialog({sla_rating, isEdit}: AddCustomerStatusDialogProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const addSlaCustomerStatusForm = useForm<z.infer<typeof addCustomerStatusFormSchema>>({
        resolver: zodResolver(addCustomerStatusFormSchema),
        defaultValues: {
            rating: sla_rating.id,
            status: isEdit ? sla_rating.customer_feedback_status?.status?.toString() || '' : ''
        },
    });

    async function onAddSlaCustomerStatusFormSubmit(values: z.infer<typeof addCustomerStatusFormSchema>) {
        const updatedValues = {
            ...values,
            status: parseInt(values.status),
        }

        if (isEdit) {
            await axios.patch(
                `${API_SLA_CUSTOMER_STATUS_URL}${sla_rating.customer_feedback_status?.id}/`,
                JSON.stringify(updatedValues),
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                }
            ).then((response) => {
                toast({
                    variant: "success",
                    title: "Request successful.",
                    description: "SLA Rating customer feedback status successfully added.",
                })
                setIsOpen(false);
                addSlaCustomerStatusForm.reset();
            }).catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: `Failed to add SLA Rating customer feedback status. There was a problem with your request. Code: ${error?.response?.status}`,
                })
            });
        } else {
            await axios.post(
                API_SLA_CUSTOMER_STATUS_URL,
                JSON.stringify(updatedValues),
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                }
            ).then((response) => {
                toast({
                    variant: "success",
                    title: "Request successful.",
                    description: "SLA Rating customer feedback status successfully added.",
                })
                setIsOpen(false);
                addSlaCustomerStatusForm.reset();
            }).catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: `Failed to add SLA Rating customer feedback status. There was a problem with your request. Code: ${error?.response?.status}`,
                })
            });
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    {
                        isEdit ? "Edit Customer Status" : "Set Customer Status"
                    }
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>
                        {
                            isEdit ? "Edit Customer Status" : "Set Customer Status"
                        }
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the required fields to set the customer status for the given SLA rating and improvement
                        action plan.<br/>
                        <p className={"font-bold"}>Rating: <RatingBadge rating={sla_rating.rating} /></p>
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
                                <StatusBadge status={sla_rating.improvement_action_plan?.status || 3}/>
                            </TableCell>
                            <TableCell
                                className={"border-x border-b align-top"}>{sla_rating.improvement_action_plan?.improvement_action}</TableCell>
                        </TableRow>

                    </TableBody>

                </Table>


                <Form {...addSlaCustomerStatusForm}>
                    <form
                        onSubmit={addSlaCustomerStatusForm.handleSubmit(onAddSlaCustomerStatusFormSubmit)}>

                        <div className="grid gap-4 py-2">

                            <FormField
                                control={addSlaCustomerStatusForm.control}
                                name="status"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel htmlFor={"role"} className={"leading-1"}>
                                            Customer Status</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select customer status"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">Resolved</SelectItem>
                                                    <SelectItem value="1">Met All</SelectItem>
                                                    <SelectItem value="2">In Progress</SelectItem>
                                                    <SelectItem value="3">Not Actioned</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>

                        </div>

                        <DialogFooter className={"justify-start"}>
                            <Button type="submit" disabled={addSlaCustomerStatusForm.formState.isSubmitting}>
                                Save changes
                            </Button>
                        </DialogFooter>

                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}