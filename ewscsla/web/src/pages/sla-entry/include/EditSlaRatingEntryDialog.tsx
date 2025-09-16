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
    API_SLA_RATING_ENTRIES_FOR_DEPARTMENT_URL,
} from "@/app/config";
import {SlaRatingEntry} from "@/types/types";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "@/components/ui/use-toast";
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
import getCookie from "@/lib/csrf";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";


const editSlaRatingEntryFormSchema = z.object({
    sla: z.number({
        required_error: "SLA field is required."
    }),
    rating: z.string({
        required_error: "Rating is required."
    }).min(1),
    reason: z.string().optional(),
}).superRefine((data, ctx) => {
    // Check if the rating is a string and can be parsed to a number
    const ratingValue = parseInt(data.rating, 10);
    // If the rating is less than 3, we require the reason field.
    if (ratingValue < 3) {
        if (!data.reason || data.reason.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Rating reason is required for ratings below 3.",
                path: ['reason'],
            });
        }
    }
})

type EditSlaRatingEntryDialogProps = {
    rating: SlaRatingEntry;
}


export default function EditSlaRatingEntryDialog({rating}: EditSlaRatingEntryDialogProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const editSlaRatingEntryForm = useForm<z.infer<typeof editSlaRatingEntryFormSchema>>({
        resolver: zodResolver(editSlaRatingEntryFormSchema),
        defaultValues: {
            sla: rating.sla.id,
            rating: rating.rating,
            reason: rating.reason || ""
        },
    });

    async function onEditSlaRatingEntryFormSubmit(values: z.infer<typeof editSlaRatingEntryFormSchema>) {
        await axios.patch(
            `${API_SLA_RATING_ENTRIES_FOR_DEPARTMENT_URL}${rating.id}/`,
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
                description: "SLA Rating Entry successfully modified.",
            })
            setIsOpen(false);
            editSlaRatingEntryForm.reset();
        }).catch((error) => {
            const data = error?.response?.data;
            if (data?.reason) {
                editSlaRatingEntryForm.setError('reason',{
                    message:  data?.reason?.[0]
                })
            }
            if (data?.rating) {
                editSlaRatingEntryForm.setError('rating', {
                    message: data?.rating?.[0]
                })
            }

            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `Failed to modify SLA Rating Entry. There was a problem with your request. Code: ${error?.response?.status}`,
            })

        });
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit SLA Rating</DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="min-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Edit SLA Rating Entry</DialogTitle>
                    <DialogDescription>
                        Fill in the required fields to rate the selected SLA Entry. If the Rating is Good, you can add
                        `N/A` for the reason<br/>
                        <p className={"font-bold whitespace-pre-line"}>
                            <span className="text-blue-600">SLA:</span> {rating.sla.key_performance_area}
                        </p>
                        <p className={"font-bold"}>
                            <span className="text-blue-600">DEPARTMENT:</span> {rating.sla.department.name}
                        </p>
                    </DialogDescription>
                </DialogHeader>


                <Form {...editSlaRatingEntryForm}>
                    <form onSubmit={editSlaRatingEntryForm.handleSubmit(onEditSlaRatingEntryFormSubmit)}>

                        <div className="grid gap-4 py-2">

                            <FormField
                                control={editSlaRatingEntryForm.control}
                                name="rating"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel htmlFor={"role"}>Rating:</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select rating"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1.00">1 - Met None</SelectItem>
                                                    <SelectItem value="2.00">2 - Met Some</SelectItem>
                                                    <SelectItem value="3.00">3 - Met All</SelectItem>
                                                    <SelectItem value="4.00">4 - Exceeded Some</SelectItem>
                                                    <SelectItem value="5.00">5 - Exceeded All</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>


                            <FormField
                                control={editSlaRatingEntryForm.control}
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
                            <Button type="submit" disabled={editSlaRatingEntryForm.formState.isSubmitting}>
                                Save changes
                            </Button>
                        </DialogFooter>

                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}