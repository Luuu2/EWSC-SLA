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
    API_ADD_SLA_ENTRY_RATING_URL,
} from "@/app/config";
import {SlaEntry} from "@/types/types";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "@/components/ui/use-toast";
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
import getCookie from "@/lib/csrf";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";


const addSlaRatingEntryFormSchema = z.object({
    sla: z.number({
        required_error: "SLA field is required."
    }),
    rating: z.string({
        required_error: "Rating is required."
    }),
    reason: z.string({
        required_error: "Rating reason is required."
    }).min(5),
})

type AddSLARatingEntryDialogProps = {
    sla: SlaEntry;
}


export default function AddSlaRatingEntryDialog(props: AddSLARatingEntryDialogProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const addSlaRatingEntryForm = useForm<z.infer<typeof addSlaRatingEntryFormSchema>>({
        resolver: zodResolver(addSlaRatingEntryFormSchema),
        defaultValues: {
            sla: props.sla.id,
            rating: '5',
            reason: ''
        },
    });

    async function onAddSlaEntryFormSubmit(values: z.infer<typeof addSlaRatingEntryFormSchema>) {
        await axios.post(
            API_ADD_SLA_ENTRY_RATING_URL,
            JSON.stringify(values),
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
                description: "SLA Rating Entry successfully added.",
            })
            setIsOpen(false);
            addSlaRatingEntryForm.reset();
        }).catch((error) => {

            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `Failed to add SLA Rating Entry. There was a problem with your request. Code: ${error?.response?.status}`,
            })

        });
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Rate SLA</DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Rate SLA Entry</DialogTitle>
                    <DialogDescription>
                        Fill in the required fields to rate the selected SLA Entry.<br/>
                        <p className={"font-bold"}>SLA: {props.sla.service_description}</p>
                        <p className={"font-bold"}>DEPARTMENT: {props.sla.department.name}</p>
                    </DialogDescription>
                </DialogHeader>


                <Form {...addSlaRatingEntryForm}>
                    <form onSubmit={addSlaRatingEntryForm.handleSubmit(onAddSlaEntryFormSubmit)}>

                        <div className="grid gap-4 py-2">

                            <FormField
                                control={addSlaRatingEntryForm.control}
                                name="rating"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel htmlFor={"role"}>Rating:</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select rating"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">1 - Poor</SelectItem>
                                                    <SelectItem value="2">2 - Fair</SelectItem>
                                                    <SelectItem value="3">3 - Good</SelectItem>
                                                    <SelectItem value="4">4 - Very Good</SelectItem>
                                                    <SelectItem value="5">5 - Excellent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>


                            <FormField
                                control={addSlaRatingEntryForm.control}
                                name="reason"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Rating Reason:</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your rating reason......."
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