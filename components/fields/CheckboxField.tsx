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
import z, { boolean } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "../hooks/useDesigner";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { Invitation } from "@clerk/nextjs/server";
import { IoMdCheckbox } from "react-icons/io";
import { Checkbox } from "../ui/checkbox";
import { SelectFieldFormElement } from "./SelectField";

const type: ElementsType = "CheckboxField";

const extraAttributes = {
  label: "Checkbox Field",
  helperText: "Helper Text",
  required: false,
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean(),
});

export const CheckboxFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: IoMdCheckbox,
    label: "Checkbox Field",
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
      return currentValue === "true";
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
  const { label, required, helperText } = element.extraAttributes;
  const id = `checkbox-${element.id}`;

  return (
    <div className="flex items-top space-x-2">
      <Checkbox id={id} />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id}>
          {label}
          {required && "*"}
        </Label>
        {helperText && (
          <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
        )}
      </div>
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
  const [value, setValue] = useState<boolean>(
    defaultValue === "true" ? true : false,
  );
  const [error, setError] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setError(isInvalid === true), [isInvalid]);

  const element = elementInstance as CustomerInstance;

  const { label, required, helperText } = element.extraAttributes;
  const id = `checkbox-${element.id}`;

  return (
    <div className="flex items-top space-x-2">
      <Checkbox
        id={id}
        checked={value}
        className={cn(error && "border-red-500")}
        onCheckedChange={(checked) => {
          let value = false;
          if (checked === true) value = true;

          setValue(true);
          if (!submitValue) return;
          const stringValue = value ? "true" : "false";
          const valid = CheckboxFieldFormElement.validate(element, stringValue);
          setError(!valid);
          submitValue(element.id, stringValue);
        }}
      />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id} className={cn(error && "border-red-500")}>
          {label}
          {required && "*"}
        </Label>
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
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [form, element]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, helperText, required } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
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
