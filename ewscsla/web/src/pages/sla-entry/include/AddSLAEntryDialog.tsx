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
import {PlusCircle} from "lucide-react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {API_ADD_SLA_ENTRY_FOR_DEPARTMENT_URL, API_GET_SLA_ENTRIES_BY_DEPARTMENT_URL} from "@/app/config";
import {Department} from "@/types/types";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useToast} from "@/components/ui/use-toast";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import {CalendarIcon} from "@radix-ui/react-icons";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useState} from "react";
import getCookie from "@/lib/csrf";


const addSlaEntryFormSchema = z.object({
    department: z.string({
        required_error: "Department field is required."
    }).min(1, {
        message: "Select a valid option."
    }),
    service_description: z.string({
        required_error: "Service description is required."
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

type AddSLAEntryDialogProps = {
    departments: Department[];
}


export default function AddSLAEntryDialog(props: AddSLAEntryDialogProps) {
    const {toast} = useToast();
    const _date = new Date();
    _date.setDate(_date.getDate() + 1);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const addSlaEntryForm = useForm<z.infer<typeof addSlaEntryFormSchema>>({
        resolver: zodResolver(addSlaEntryFormSchema),
        defaultValues: {
            department: '',
            service_description: '',
            customer_responsibility: '',
            service_level: '',
            date: _date
        },
    });

    async function onAddSlaEntryFormSubmit(values: z.infer<typeof addSlaEntryFormSchema>) {
        const updatedValues = {
            ...values,
            department: parseInt(values.department),
            date: format(values.date, "yyyy-MM-dd")
        }
        await axios.post(
            API_ADD_SLA_ENTRY_FOR_DEPARTMENT_URL,
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
                description: "SLA Entry successfully added.",
            })
            setIsOpen(false);
            addSlaEntryForm.reset();
        }).catch((error) => {

            if (error?.response?.data?.error) {
                // handle a maximum of 5 SLA per department
                toast({
                    variant: "destructive",
                    title: "Uh oh! Maximum SLAs Reached.",
                    description: `Failed to add SLA Entry. Each department can have a maximum of 5 SLA.`,
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: `Failed to add SLA Entry. There was a problem with your request. Code: ${error?.response?.status}`,
                })
            }
        });
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-7 gap-1">
                    <PlusCircle className="h-3.5 w-3.5"/>
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add SLA Entry
                  </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Add New SLA Entry</DialogTitle>
                    <DialogDescription>
                        Fill in the required fields to enter a new SLA Entry.
                        Please note each department can only have a maximum of 5 SLA entries.
                        Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] ">

                    <Form {...addSlaEntryForm}>
                        <form onSubmit={addSlaEntryForm.handleSubmit(onAddSlaEntryFormSubmit)} className={"px-3"}>

                            <div className="grid gap-4 py-2">

                                <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
                                    <FormField
                                        control={addSlaEntryForm.control}
                                        name="department"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel htmlFor={"role"}
                                                           className={"leading-1"}>Department</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select department"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {
                                                                props.departments.map((department, index) => (
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
                                        control={addSlaEntryForm.control}
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
                                    control={addSlaEntryForm.control}
                                    name="service_description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Service description:</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Explain your service description"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                <FormField
                                    control={addSlaEntryForm.control}
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
                                    control={addSlaEntryForm.control}
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
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>

                        </form>
                    </Form>

                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}