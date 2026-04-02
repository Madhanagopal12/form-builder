"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { ImShare } from "react-icons/im";

function FormLinkShare({ sharedUrl }: { sharedUrl: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // avoising window not defined error
  }

  const shareLink = `${window.location.origin}/submit/${sharedUrl}`;

  return (
    <div className="flex grow gap-4 items-center">
      <Input value={sharedUrl} readOnly />
      <Button
        className="max-w-[250px]"
        onClick={() => {
          navigator.clipboard.writeText(shareLink);
          toast("Copied", {
            description: "Link copied to clipboard",
          });
        }}
      >
        <ImShare className="mr-2 h-4 w-4" />
        Share Link
      </Button>
    </div>
  );
}

export default FormLinkShare;
