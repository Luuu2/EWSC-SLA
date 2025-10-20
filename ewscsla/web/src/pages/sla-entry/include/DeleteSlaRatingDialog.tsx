import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SlaRatingEntry } from "@/types/types";
import { LoadingButton } from "@/components/ui/loadingButton";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { API_SLA_RATING_ENTRIES_FOR_DEPARTMENT_URL } from "@/app/config";
import getCookie from "@/lib/csrf";

type DeleteSlaRatingDialogProps = {
  sla_rating: SlaRatingEntry;
  onDeleteSuccess: () => void;
};

export default function DeleteSlaRatingDialog({
  sla_rating,
  onDeleteSuccess,
}: DeleteSlaRatingDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    try {
      await axios.delete(
        `${API_SLA_RATING_ENTRIES_FOR_DEPARTMENT_URL}${sla_rating.id}/`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
        }
      );

      toast({
        variant: "success",
        title: "Deleted successfully.",
        description: `SLA Rating for ${sla_rating.sla.key_performance_area.substring(
          0,
          30
        )}... has been removed.`,
      });
      onDeleteSuccess();
      setIsOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ detail: string }>;
        if (axiosError.response?.data?.detail) {
          errorMessage = axiosError.response.data.detail;
        } else if (axiosError.message) {
          // Fallback to the generic Axios message
          errorMessage = axiosError.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Deletion failed.",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          className={"text-red-600 hover:text-red-700 focus:text-red-700"}
        >
          Delete SLA Rating
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            rating for the SLA:{" "}
            <span className="font-bold">
              {sla_rating.sla.key_performance_area.substring(0, 100)}...
            </span>
            <br />
            <br />
            <span className="font-bold">Rating:</span> {sla_rating.rating}
            <br />
            <span className="font-bold">Reason:</span>{" "}
            {sla_rating.reason || "N/A"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <LoadingButton
            loading={isLoading}
            onClick={handleDelete}
            variant="destructive"
          >
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
