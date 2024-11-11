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
import {format} from "date-fns";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {API_GET_SLA_ENTRIES_BY_DEPARTMENT_URL} from "@/app/config";
import {Department, SlaEntry} from "@/types/types";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "@/components/ui/use-toast";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import {CalendarIcon} from "@radix-ui/react-icons";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useState} from "react";
import getCookie from "@/lib/csrf";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";


const editSlaEntryFormSchema = z.object({
    department: z.string({
        required_error: "Department field is required."
    }).min(1, {
        message: "Select a valid option."
    }),
    key_performance_area: z.string({
        required_error: "Key performance area is required."
    }).min(5),
    service_provider_responsibility: z.string({
        required_error: "Service provider responsibility is required."
    }).min(5),
    customer_responsibility: z.string({
        required_error: "Customer responsibility is required."
    }).min(5),
    service_level: z.string({
        required_error: "Service level is required."
    }).min(5),
    date: z.date({
        required_error: "Date is required."
    }),
})

type EditSlaEntryDialogProps = {
    departments: Department[];
    sla: SlaEntry;
}


export default function EditSlaEntryDialog({sla, departments}: EditSlaEntryDialogProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const editSlaEntryForm = useForm<z.infer<typeof editSlaEntryFormSchema>>({
        resolver: zodResolver(editSlaEntryFormSchema),
        defaultValues: {
            department: `${sla.department.id}`,
            key_performance_area: sla.key_performance_area,
            service_provider_responsibility: sla.service_provider_responsibility,
            customer_responsibility: sla.customer_responsibility,
            service_level: sla.service_level,
            date: new Date(sla.date)
        },
    });

    async function onEditSlaEntryFormSubmit(values: z.infer<typeof editSlaEntryFormSchema>) {
        const updatedValues = {
            ...values,
            department: parseInt(values.department),
            date: format(values.date, "yyyy-MM-dd")
        }
        await axios.patch(
            `${API_GET_SLA_ENTRIES_BY_DEPARTMENT_URL}${sla.id}/`,
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
                description: "SLA Entry successfully modified.",
            })
            setIsOpen(false);
            editSlaEntryForm.reset();
        }).catch((error) => {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `Failed to edit SLA Entry. There was a problem with your request. Code: ${error?.response?.status}`,
            })
        });
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit SLA Entry</DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Add New SLA Entry</DialogTitle>
                    <DialogDescription>
                        Fill in the required fields to enter a new SLA Entry.
                        Please note each department can have an unlimited number of SLA entries.
                        Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] ">

                    <Form {...editSlaEntryForm}>
                        <form onSubmit={editSlaEntryForm.handleSubmit(onEditSlaEntryFormSubmit)} className={"px-3"}>

                            <div className="grid gap-4 py-2">

                                <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
                                    <FormField
                                        control={editSlaEntryForm.control}
                                        name="department"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel htmlFor={"role"}
                                                           className={"leading-1"}>Department</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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


                                    <FormField
                                        control={editSlaEntryForm.control}
                                        name="date"
                                        render={({field}) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className={"leading-2"}>Date:</FormLabel>
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
                                    control={editSlaEntryForm.control}
                                    name="key_performance_area"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Key Performance Area:</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Explain your performance area...."
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                <FormField
                                    control={editSlaEntryForm.control}
                                    name="service_provider_responsibility"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Service Provider Responsibility:</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Explain the service provider responsibility."
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                <FormField
                                    control={editSlaEntryForm.control}
                                    name="customer_responsibility"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Customer responsibility:</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Explain the customer responsibility"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                <FormField
                                    control={editSlaEntryForm.control}
                                    name="service_level"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Service level:</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Explain the service level"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                            </div>

                            <DialogFooter className={"justify-start"}>
                                <Button type="submit" disabled={editSlaEntryForm.formState.isSubmitting}>
                                    Save changes
                                </Button>
                            </DialogFooter>

                        </form>
                    </Form>

                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}