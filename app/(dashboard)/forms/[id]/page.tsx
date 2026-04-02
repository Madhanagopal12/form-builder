import { GetFormById } from "@/actions/form";
import { Divide } from "lucide-react";
import React from "react";
import FormBuilder from "@/components/FormBuilder";
import VisitBtn from "@/components/VisitBtn";
import FormLinkShare from "@/components/FormLinkShare";
import { StatsCard } from "../../page";
import { LuView } from "react-icons/lu";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";

async function FormDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await GetFormById(Number(id));

  if (!form) throw new Error("Form not found");

  const { visits, submissions } = form;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return (
    <>
      <div className="py-10 border-b  border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-blue truncate">{form.name}</h1>
          <VisitBtn sharedUrl={form.shareURL} />
        </div>
      </div>
      <div className="px-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare sharedUrl={form.shareURL} />
        </div>
      </div>
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
        <StatsCard
          className="shadow-md shadow-blue-600"
          title="Total Visits"
          icon={<LuView className="text-blue-600" />}
          helperText="All time form visits"
          value={visits.toLocaleString() || ""}
          loading={false}
        />
        <StatsCard
          className="shadow-md shadow-yellow-600"
          title="Total Submissions"
          icon={<HiCursorClick className="text-yellow-600" />}
          helperText="All time form submissions"
          value={submissions.toLocaleString() || ""}
          loading={false}
        />
        <StatsCard
          className="shadow-md shadow-green-600"
          title="Submissions Rate"
          icon={<HiCursorClick className="text-green-600" />}
          helperText="Visits that result in form submissions"
          value={submissionRate.toLocaleString() + "%" || ""}
          loading={false}
        />
        <StatsCard
          className="shadow-md shadow-red-600"
          title="Bounce Rate"
          icon={<TbArrowBounce className="text-red-600" />}
          helperText="Visits that leaves without interacting"
          value={bounceRate.toLocaleString() + "%" || ""}
          loading={false}
        />
      </div>
    </>
  );
}

export default FormDetailPage;
