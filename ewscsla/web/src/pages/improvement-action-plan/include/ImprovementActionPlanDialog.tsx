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
    API_ADD_SLA_IMPROVEMENT_ACTION_PLAN_URL,
} from "@/app/config";
import {SlaRatingEntry} from "@/types/types";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "@/components/ui/use-toast";
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
import getCookie from "@/lib/csrf";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {CalendarIcon} from "@radix-ui/react-icons";
import {Calendar} from "@/components/ui/calendar";
import {RatingBadge} from "@/pages/sla-entry/tabs/your-sla-ratings-tab";


const addSlaImprovementActionPlanFormSchema = z.object({
    rating: z.number({
        required_error: "SLA Rating field is required."
    }),
    improvement_action: z.string({
        required_error: "Rating is required."
    }).min(5),
    status: z.string({
        required_error: "Manger status is required."
    }).min(1, {
        message: 'Manager status is required.'
    }),
    due_date: z.date({
        required_error: "Due date is required."
    }),
})

type ImprovementActionPlanDialogProps = {
    sla_rating: SlaRatingEntry;
    isEdit?: boolean;
}


export default function ImprovementActionPlanDialog({sla_rating, isEdit}: ImprovementActionPlanDialogProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const addSlaImprovementActionPlanForm = useForm<z.infer<typeof addSlaImprovementActionPlanFormSchema>>({
        resolver: zodResolver(addSlaImprovementActionPlanFormSchema),
        defaultValues: {
            rating: sla_rating.id,
            improvement_action: isEdit ? sla_rating.improvement_action_plan?.improvement_action : '',
            due_date: isEdit ? new Date(sla_rating.improvement_action_plan?.due_date) : new Date(),
            status: isEdit ? sla_rating.improvement_action_plan?.status?.toString() : ""
        },
    });

    async function onAddSlaImprovementActionPlanFormSubmit(values: z.infer<typeof addSlaImprovementActionPlanFormSchema>) {
        const updatedValues = {
            ...values,
            status: parseInt(values.status),
            due_date: format(values.due_date, "yyyy-MM-dd")
        }

        if (isEdit) {
            await axios.patch(
                `${API_ADD_SLA_IMPROVEMENT_ACTION_PLAN_URL}${sla_rating.improvement_action_plan?.id}/`,
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
                    description: "SLA Improvement action plan successfully added.",
                })
                setIsOpen(false);
                addSlaImprovementActionPlanForm.reset();
            }).catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: `Failed to add SLA Improvement action plan. There was a problem with your request. Code: ${error?.response?.status}`,
                })
            });
        } else {
            await axios.post(
                API_ADD_SLA_IMPROVEMENT_ACTION_PLAN_URL,
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
                    description: "SLA Improvement action plan successfully added.",
                })
                setIsOpen(false);
                addSlaImprovementActionPlanForm.reset();
            }).catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: `Failed to add SLA Improvement action plan. There was a problem with your request. Code: ${error?.response?.status}`,
                })
            });
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    {isEdit ? "Edit Improvement Action Plan" : "Add Improvement Action Plan"}
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit Improvement Action Plan" : "Add Improvement Action Plan"}
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the required fields to add/edit an improvement action plan.<br/>
                        <p className={"font-bold"}>
                            Rating: {sla_rating.rating} <RatingBadge rating={sla_rating.rating}/>
                        </p>
                        <p className={"font-bold"}>Reason: {sla_rating.reason}</p>
                    </DialogDescription>
                </DialogHeader>


                <Form {...addSlaImprovementActionPlanForm}>
                    <form
                        onSubmit={addSlaImprovementActionPlanForm.handleSubmit(onAddSlaImprovementActionPlanFormSubmit)}>

                        <div className="grid gap-4 py-2">

                            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
                                <FormField
                                    control={addSlaImprovementActionPlanForm.control}
                                    name="status"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel htmlFor={"role"} className={"leading-1"}>
                                                Manager Status</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select manager status"/>
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

                                <FormField
                                    control={addSlaImprovementActionPlanForm.control}
                                    name="due_date"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className={"leading-2"}>Due Date:</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => {
                                                            const _date = new Date();
                                                            _date.setDate(_date.getDate() - 1);
                                                            return date < _date || date < new Date("1900-01-01")
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <FormField
                                control={addSlaImprovementActionPlanForm.control}
                                name="improvement_action"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Improvement Action Plan:</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your improvement action plan for this rating......."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>

                        </div>

                        <DialogFooter className={"justify-start"}>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>

                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}