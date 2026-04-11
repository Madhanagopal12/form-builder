import {
  GetFormById,
  GetFormStats,
  GetFormWithSubmissions,
} from "@/actions/form";
import { Columns, Divide } from "lucide-react";
import React, { ReactNode } from "react";
import FormBuilder from "@/components/FormBuilder";
import VisitBtn from "@/components/VisitBtn";
import FormLinkShare from "@/components/FormLinkShare";
import { StatsCard } from "../../page";
import { LuView } from "react-icons/lu";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import { ElementsType, FormElementInstance } from "@/components/FormElements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

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

      <div className="container pt-10">
        <SubmissionsTable id={form.id} />
      </div>
    </>
  );
}

type Row = { [key: string]: string } & {
  submittedAt: Date;
};

async function SubmissionsTable({ id }: { id: number }) {
  const form = await GetFormWithSubmissions(id);

  if (!form) throw new Error("Form not found...");

  const formElements = JSON.parse(form.content) as FormElementInstance[];

  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  formElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
      case "TitleField":
      case "SubTitleField":
      case "ParagraphField":
      case "SeparatorField":
      case "SpacerField":
      case "NumberField":
      case "TextAreaField":
      case "DateField":
      case "SelectField":
      case "CheckboxField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });

  const rows: Row[] = [];

  form.formSubmissions.forEach((submission) => {
    const content = JSON.parse(submission.content);
    rows.push({
      ...content,
      submittedAt: submission.createatedAt,
    });
  });

  return (
    <>
      <h1 className="text-2xl font-bold my-4">Submissions</h1>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-forefround uppercase">
                Submitted at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;
  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>;
      break;
    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;
  }
  return <TableCell>{node}</TableCell>;
}

export default FormDetailPage;
