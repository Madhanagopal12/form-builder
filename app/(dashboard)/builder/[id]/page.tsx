import { GetFormById } from "@/actions/form";
import { Divide } from "lucide-react";
import React from "react";
import FormBuilder from "@/components/FormBuilder";

async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await GetFormById(Number(id));

  if (!form) throw new Error("Form not found");

  return <FormBuilder form={form} />;
}

export default BuilderPage;
