import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { HiSaveAs } from "react-icons/hi";
import useDesigner from "./hooks/useDesigner";
import { UpdateFormContent } from "@/actions/form";
import { start } from "repl";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";

function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  const updateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      await UpdateFormContent(id, jsonElements);
      toast.success("Success", {
        description: "Form has been saved",
      });
    } catch {
      toast.error("Error", {
        description: "Something went wrong",
      });
    }
  };

  return (
    <Button
      onClick={() => startTransition(updateFormContent)}
      disabled={loading}
      variant={"outline"}
      className="gap-2"
    >
      <HiSaveAs className="h-4 w-4" />
      Save
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  );
}

export default SaveFormBtn;
