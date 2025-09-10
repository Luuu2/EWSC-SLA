import { useState, useEffect } from "react";
import { format, subMonths, parseISO } from "date-fns";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { LoadingButton } from "@/components/ui/loadingButton";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_EMAILS_URL } from "@/app/config";
import getCookie from "@/lib/csrf";

// Define the type for the data we expect from the API
type DepartmentSummary = {
  id: number;
  name: string;
  total_entries: number;
  rated_entries: number;
  unrated_entries: number;
};

// Function to generate the list of the last 12 months
const generateMonths = () => {
  const months = [];
  const currentDate = new Date();
  for (let i = 0; i < 12; i++) {
    const month = subMonths(currentDate, i);
    months.push({
      value: format(month, "yyyy-MM"),
      label: format(month, "MMMM yyyy"),
    });
  }
  return months;
};

export default function DepartmentSlaSummary() {
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Generate the list of months once
  const monthOptions = generateMonths();

  // Only 'toMonth' is needed as a state variable
  const defaultToMonth = format(new Date(), "yyyy-MM");
  const [toMonth, setToMonth] = useState(defaultToMonth);

  // Function to fetch the department summary data
  const fetchDepartmentData = async () => {
    setIsLoading(true);
    try {
      // Calculate 'fromMonth' dynamically based on 'toMonth'
      const fromMonth = format(subMonths(parseISO(toMonth), 3), "yyyy-MM");

      const response = await axios.get(`${API_EMAILS_URL}`, {
        params: {
          from_month: fromMonth,
          to_month: toMonth,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      });
      setDepartments(response.data);
      toast({
        variant: "success",
        title: "Data loaded.",
        description: `Department SLA summary loaded successfully. From ${fromMonth} to ${toMonth}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to load department data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Data fetch is now triggered whenever 'toMonth' changes
  useEffect(() => {
    fetchDepartmentData();
  }, [toMonth]);

  // Function to handle sending emails (remains unchanged)
  const sendEmails = async (departmentIds: number[] = []) => {
    setIsSendingEmail(true);
    try {
      const response = await axios.post(
        `${API_EMAILS_URL}send-emails/`,
        {
          department_ids: departmentIds,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
        }
      );
      const {
        status: responseStatus,
        sent_count: sentCount,
        total_count: totalCount,
      } = response.data;

      // Handle success based on the status code from the backend
      if (responseStatus === 1) {
        toast({
          variant: "success",
          title: "Success! Emails sent.",
          description: `All ${sentCount} notification emails sent successfully.`,
        });
      } else if (responseStatus === 2) {
        toast({
          variant: "warning",
          title: "Partial Success.",
          description: `Sent ${sentCount} out of ${totalCount} emails. Some may have failed.`,
        });
      } else {
        // status === 3
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Failed to send any emails. Please check the logs.`,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to send emails. Please try again.",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <Card className="min-h-[300px] mb-5">
      <CardHeader className="flex flex-col md:flex-row justify-between md:items-center px-7">
        <div className={"flex-1 grid gap-2"}>
          <CardTitle className={"text-3xl font-semibold tracking-tight"}>
            Department SLA Summary
          </CardTitle>
          <CardDescription>
            View a summary of SLA ratings by department and send notification
            emails.
          </CardDescription>
        </div>

        <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
          <div className="flex flex-col gap-1">
            <Select value={toMonth} onValueChange={setToMonth}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {monthOptions.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">** 3 months back.</p>
          </div>
          <LoadingButton
            loading={isLoading}
            onClick={fetchDepartmentData}
            size="default"
          >
            Filter
          </LoadingButton>
          <LoadingButton
            loading={isSendingEmail}
            onClick={() => sendEmails()}
            size="default"
            variant="secondary"
          >
            Send Emails to All
          </LoadingButton>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Department</TableHead>
              <TableHead className="w-[20%] text-center">
                Total Entries
              </TableHead>
              <TableHead className="w-[20%] text-center">Rated</TableHead>
              <TableHead className="w-[20%] text-center">Unrated</TableHead>
              <TableHead className="w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : departments.length > 0 ? (
              departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell className="text-center">
                    {dept.total_entries}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={cn(
                        "text-center",
                        dept.rated_entries === 0 && "bg-gray-400"
                      )}
                    >
                      {dept.rated_entries}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="destructive"
                      className={cn(
                        "text-center",
                        dept.unrated_entries === 0 && "bg-gray-400"
                      )}
                    >
                      {dept.unrated_entries}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <LoadingButton
                      loading={isSendingEmail}
                      onClick={() => sendEmails([dept.id])}
                      size="sm"
                    >
                      Send Email
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No data available for the selected date range.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
