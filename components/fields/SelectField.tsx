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
import { RxDropdownMenu } from "react-icons/rx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TbHttpOptions } from "react-icons/tb";
import { Button } from "../ui/button";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

const type: ElementsType = "SelectField";

const extraAttributes = {
  label: "Select Field",
  helperText: "Helper Text",
  required: false,
  placeHolder: "Value here...",
  options: [],
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean(),
  placeHolder: z.string().max(50),
  options: z.array(z.string()),
});

export const SelectFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: RxDropdownMenu,
    label: "Select Field",
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
  const { label, required, placeHolder, helperText } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeHolder} />
        </SelectTrigger>
      </Select>
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

  const { label, required, placeHolder, helperText, options } =
    element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Select
        defaultValue={value}
        onValueChange={(value) => {
          setValue(value);
          if (!submitValue) return;
          const valid = SelectFieldFormElement.validate(element, value);
          setError(!valid);
          submitValue(element.id, value);
        }}
      >
        <SelectTrigger className={cn("w-full", error && "border-red-500")}>
          <SelectValue placeholder={placeHolder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
  const { updateElement, setSelectedElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onSubmit",
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeHolder: element.extraAttributes.placeHolder,
      options: element.extraAttributes.options,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [form, element]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, helperText, required, placeHolder, options } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
        placeHolder,
        options,
      },
    });
    toast.success("Sucess", {
      description: "properties saved successfully",
    });
    setSelectedElement(null);
  }

  return (
    <form
      onSubmit={form.handleSubmit(applyChanges)}
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
      <Separator />
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
      <Separator />
      <Controller
        name="options"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <div className="flex justify-between items-center">
              <FieldLabel>Options</FieldLabel>
              <Button
                variant={"outline"}
                className="gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  form.setValue("options", field.value.concat("New option"));
                }}
              >
                <AiOutlinePlus />
                Add
              </Button>
            </div>
            <div className="flex flex-col gap-2 ">
              {form.watch("options").map((option, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-1"
                >
                  <Input
                    placeholder=""
                    value={option}
                    onChange={(e) => {
                      field.value[index] = e.target.value;
                      field.onChange(field.value);
                    }}
                  />
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={(e) => {
                      e.preventDefault();
                      const newOptions = [...field.value];
                      newOptions.splice(index, 1);
                      field.onChange(newOptions);
                    }}
                  >
                    <AiOutlineClose />
                  </Button>
                </div>
              ))}
            </div>
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
      <Separator />
      <Button className="w-full" type="submit">
        Save
      </Button>
    </form>
  );
}
