import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingButton } from "@/components/ui/loadingButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Department, SlaRatingEntry } from "@/types/types";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { searchSlasFormSchema } from "@/pages/sla-entry";
import ViewImprovementActionPlanDialog from "@/pages/improvement-action-plan/include/ViewImprovementActionPlanDialog";
// import CustomerStatusDialog from "@/pages/sla-entry/include/CustomerStatusDialog";
// import EditSlaRatingEntryDialog from "@/pages/sla-entry/include/EditSlaRatingEntryDialog";
import { RatingBadge, StatusBadge } from "./your-sla-ratings-tab";
import { API_SLA_RATING_ENTRIES_FOR_DEPARTMENT_URL } from "@/app/config";

type AllSlaRatingsTabProps = {
  searchSlasForm: any;
  departments: Department[];
};

export default function AllSlaRatingsTab({
  searchSlasForm,
  departments,
}: AllSlaRatingsTabProps) {
  const [allSlaRatingEntries, setAllSlaRatingEntries] = useState<
    SlaRatingEntry[]
  >([]);

  const [filterBy, setFilterBy] = useState<string>("all");

  async function onSearchAllSlaEntryRatings(
    values: z.infer<typeof searchSlasFormSchema>
  ) {
    const params: { department?: string; filter_by?: string } = {};

    if (values.department) {
      params.department = values.department;
    }

    // Check if the user wants to filter by their own SLA entries
    if (filterBy === "my_entries") {
      params.filter_by = "my_entries";
    }

    await axios
      .get(API_SLA_RATING_ENTRIES_FOR_DEPARTMENT_URL, {
        params: params,
      })
      .then((response) => {
        console.log("All SLA ratings response:", response.data);
        setAllSlaRatingEntries(response.data.results || []);
        toast({
          variant: "success",
          title: "Request successful.",
          description:
            "All SLA Ratings for selected department updated successfully.",
        });
      })
      .catch((error) => {
        console.error("Error fetching all SLA ratings:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "Failed to load all SLA Ratings. There was a problem with your request. ",
        });
      });
  }

  return (
    <Card className="min-h-[300px] mb-5">
      <CardHeader className="flex flex-col md:flex-row justify-between md:items-center px-7">
        <div className={"flex-1 grid gap-2"}>
          {/* Conditional rendering for the title and description */}
          {filterBy === "my_entries" ? (
            <>
              <CardTitle className={"text-3xl font-semibold tracking-tight"}>
                All SLA Ratings | Related to your entries
              </CardTitle>
              <CardDescription className={"max-w-lg"}>
                Browse all ratings on the SLA entries you have created. This shows all the ratings related to the SLA entries you have entered.
                Ratings for all the SLA Entries you OWN.
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle className={"text-3xl font-semibold tracking-tight"}>
                All SLA Ratings
              </CardTitle>
              <CardDescription className={"max-w-lg"}>
                Browse and filter all SLA ratings in the system.
              </CardDescription>
            </>
          )}
        </div>

        <Form {...searchSlasForm}>
          <form
            onSubmit={searchSlasForm.handleSubmit(onSearchAllSlaEntryRatings)}
            className={"flex flex-col md:flex-row gap-2"}
          >
            <FormField
              control={searchSlasForm.control}
              name="department"
              render={({ field }) => (
                <FormItem className={"min-w-[200px]"}>
                  <FormLabel htmlFor={"role"}>Department</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="overflow-y-auto max-h-[15rem]">
                          {departments.map((department, index) => (
                            <SelectItem key={index} value={`${department.id}`}>
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New filter for ratings related to user's SLA entries */}
            <FormItem className={"min-w-[200px]"}>
              <FormLabel>Filter</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => setFilterBy(value)}
                  defaultValue={filterBy}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select filter option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="my_entries">
                        Ratings on My Entries
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>

            <LoadingButton
              loading={searchSlasForm.formState.isSubmitting}
              size={"default"}
              className={"md:mt-8"}
              type={"submit"}
            >
              Search All Ratings
            </LoadingButton>
          </form>
        </Form>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={"border-x border-t w-[25%]"}>SLA</TableHead>
              <TableHead className="border-x border-t w-[10%]">
                Department
              </TableHead>
              <TableHead className="border-x border-t w-[10%]">
                Rated By
              </TableHead>
              <TableHead className="border-x border-t lg:w-[10%]">
                Rating
              </TableHead>
              <TableHead className="border-x border-t w-[15%]">
                Reason
              </TableHead>
              <TableHead className="border-x border-t w-[20%]">
                Improvement Plan
              </TableHead>
              <TableHead className="border-x border-t w-[10%]">
                Customer Status
              </TableHead>
              <TableHead className="border-x border-t w-[10%]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(allSlaRatingEntries) &&
            allSlaRatingEntries.length >= 1 ? (
              allSlaRatingEntries.map((rating, index) => (
                <TableRow
                  key={index}
                  className={cn(index % 2 === 0 && "bg-accent")}
                >
                  <TableCell
                    className={"border-x align-top whitespace-pre-line"}
                  >
                    {rating?.sla?.key_performance_area}
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge className="text-xs" variant="outline">
                      {rating?.sla?.department?.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="border-x align-top">
                    {rating.rated_by}
                  </TableCell>
                  <TableCell className="border-x align-top">
                    <RatingBadge rating={rating.rating} />
                  </TableCell>
                  <TableCell className="border-x align-top">
                    {rating.reason || "N/A"}
                  </TableCell>
                  <TableCell className={"border-x align-top"}>
                    {rating.improvement_action_plan?.improvement_action ||
                      "N/A"}
                  </TableCell>
                  <TableCell className={"border-x align-top"}>
                    {rating.customer_feedback_status ? (
                      <StatusBadge
                        status={rating.customer_feedback_status.status}
                      />
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell className={"border-x align-top"}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {rating.improvement_action_plan?.improvement_action ? (
                          <>
                            <ViewImprovementActionPlanDialog
                              sla_rating={rating}
                            />
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                toast({
                                  title: "Coming soon.",
                                  description:
                                    "Not yet implemented. Coming soon.",
                                });
                              }}
                            >
                              Delete SLA Rating
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-accent">
                <TableCell
                  colSpan={8}
                  className={"border-x border-t text-center"}
                >
                  <div className="text-muted-foreground">No Data.</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
