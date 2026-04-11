"use client";

import { MdTextFields } from "react-icons/md";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
  FormElements,
  SubmitFunction,
} from "../FormElements";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import z, { boolean, number } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "../hooks/useDesigner";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { Invitation } from "@clerk/nextjs/server";
import { BsTextareaResize } from "react-icons/bs";
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";

const type: ElementsType = "TextAreaField";

const extraAttributes = {
  label: "TextArea Field",
  helperText: "Helper Text",
  required: false,
  placeHolder: "Value here...",
  rows: 3,
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean(),
  placeHolder: z.string().max(50),
  rows: z.number().min(1).max(10),
});

export const TextAreaFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: BsTextareaResize,
    label: "TextArea Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (
    formElement: FormElementInstance,
    currentValue: string,
  ): boolean => {
    const element = formElement as CustomerInstance;
    if (element.extraAttributes.required) {
      return currentValue.length > 0;
    }

    return true;
  },
};

type CustomerInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomerInstance;
  const { label, required, placeHolder, helperText, rows } =
    element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Textarea disabled readOnly placeholder={placeHolder} />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}

function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setError(isInvalid === true), [isInvalid]);

  const element = elementInstance as CustomerInstance;

  const { label, required, placeHolder, helperText, rows } =
    element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Textarea
        style={{ maxHeight: `${rows * 24}px` }}
        className={cn(error && "border-red-500")}
        placeholder={placeHolder}
        rows={rows}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitValue) return;
          const valid = TextAreaFieldFormElement.validate(
            element,
            e.target.value,
          );
          setError(!valid);
          if (!valid) return;
          submitValue(element.id, e.target.value);
        }}
        value={value}
      />
      {helperText && (
        <p
          className={cn(
            "text-muted-foreground text-[0.8rem]",
            error && "text-red-500",
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomerInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeHolder: element.extraAttributes.placeHolder,
      rows: element.extraAttributes.rows,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [form, element]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, helperText, required, placeHolder, rows } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
        placeHolder,
        rows,
      },
    });
  }

  return (
    <form
      onBlur={form.handleSubmit(applyChanges)}
      onSubmit={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
      className="space-y-3"
    >
      <Controller
        name="label"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Label</FieldLabel>
            <Input {...field} />
            <FieldDescription>
              The labe of the field. <br />
              This will be displayed above the field
            </FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="placeHolder"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>PlaceHolder</FieldLabel>
            <Input {...field} />
            <FieldDescription>The placeholder of the field.</FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="helperText"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>HelperText</FieldLabel>
            <Input {...field} />
            <FieldDescription>
              The helperText of the field. <br />
              This will be shown below the field
            </FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="rows"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Rows {form.watch("rows")}</FieldLabel>
            <Slider
              defaultValue={[field.value]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => field.onChange(value[0])}
            />
            <FieldDescription>
              The helperText of the field. <br />
              This will be shown below the field
            </FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="required"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0 5">
              <FieldLabel>Required</FieldLabel>
            </div>
            <div className="flex flex-row gap-8 items-center justify-self-start">
              <FieldDescription>
                The is the required field. <br />
                This will be shown below the field
              </FieldDescription>

              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </div>

            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </form>
  );
}
