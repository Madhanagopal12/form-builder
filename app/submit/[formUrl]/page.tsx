import { GetFormContentByUrl } from "@/actions/form";
import { FormElementInstance } from "@/components/FormElements";
import FormSubmitComponent from "@/components/FormSubmitComponent";
import React from "react";

async function SubmitPage({
  params,
}: {
  params: Promise<{ formUrl: string }>;
}) {
  const { formUrl } = await params;

  const form = await GetFormContentByUrl(formUrl);

  const formContent = JSON.parse(form.content) as FormElementInstance[];

  if (!form) throw new Error("Form not found");
  return <FormSubmitComponent formUrl={formUrl} content={formContent} />;
}

export default SubmitPage;
