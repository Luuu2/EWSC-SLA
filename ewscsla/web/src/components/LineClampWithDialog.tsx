import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Ensure you have these components
import { cn } from "@/lib/utils";


type LineClampWithDialogProps = {
    title: string;
    content: string;
    clampSize?: string;
}


const LineClampWithDialog = ({ title, content, clampSize = 'small'}: LineClampWithDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col space-y-4">
      {/* Truncated Text with Tailwind Line Clamp */}
      <p className={
        cn(
          "text-gray-800 whitespace-pre-line",
          clampSize === 'small' && "line-clamp-[10]",
          clampSize === 'large' && "line-clamp-[20]"
        )
      }>
        {content}
      </p>

      {/* See More Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="text-blue-600 underline focus:outline-none">
            See More
          </button>
        </DialogTrigger>

        {/* Dialog Content */}
        <DialogContent className="min-w-[750px] overflow-y-scroll max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Full Content: {title}</DialogTitle>
          </DialogHeader>
          <div className="p-2">
            <p className="whitespace-pre-line">{content}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LineClampWithDialog;