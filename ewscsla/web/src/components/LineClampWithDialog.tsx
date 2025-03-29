import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Ensure you have these components
import { cn } from "@/lib/utils";


type LineClampWithDialogProps = {
  title: string;
  content: string;
  clampValue?: number;
}


const LineClampWithDialog = ({ title, content, clampValue = 8 }: LineClampWithDialogProps) => {
  const [isClamped, setIsClamped] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight; // Total height of the content
      const clampHeight = parseInt(getComputedStyle(contentRef.current).lineHeight) * clampValue; // Height of visible clamped lines
      setIsClamped(contentHeight > clampHeight);
    }
  }, [clampValue, content]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Truncated Text with Tailwind Line Clamp */}
      <p ref={contentRef} className="text-gray-800 whitespace-pre-line line-clamp-[8]">
        {content}
      </p>

      {/* See More Button */}
      {
        isClamped && (
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
        )
      }
    </div>
  );
};

export default LineClampWithDialog;