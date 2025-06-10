// src/components/SubtopicsList.jsx
import React from "react";
import { Button } from "@/components/ui/button";

const SubtopicsList = ({ subtopics, onSelect }) => {
  return (
    <div className="p-4 space-y-2">
      {subtopics.map((sub) => {
        console.log("Subtopic data:", sub);
        return (
          <div key={sub.id} className="flex justify-center">
            <Button
              variant="outline"
              className="relative group overflow-visible px-6 py-3"
              onClick={() => onSelect(sub)}
            >
              {/* Display sub.id by default */}
              <span className="font-medium">
                {sub.id}
              </span>

              {/* Dropdown for sub.name on hover - simplified transition */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max min-w-full bg-popover text-popover-foreground border border-border rounded-md shadow-lg z-20
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 ease-in-out p-2 text-center">
                <span className="text-sm">
                  {sub.name}
                </span>
              </div>
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default SubtopicsList;
