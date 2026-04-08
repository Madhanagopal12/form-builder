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
import { LuHeading1, LuSeparatorHorizontal } from "react-icons/lu";
import { Slider } from "../ui/slider";

const type: ElementsType = "SpacerField";

const extraAttributes = {
  height: 20,
};

const propertiesSchema = z.object({
  height: z.number().min(5).max(200),
});

export const SpacerFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: LuSeparatorHorizontal,
    label: "Space Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true,
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
  const { height } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <Label className="text-muted-foreground">
        Seperator Field: {height}px
      </Label>
      <LuSeparatorHorizontal className="h-8 w-8" />
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomerInstance;

  const { height } = element.extraAttributes;

  return <div style={{ height, width: "100%" }}></div>;
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
      height: element.extraAttributes.height,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [form, element]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { height } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        height,
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
        name="height"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Height (px): {form.watch("height")}</FieldLabel>
            <Slider
              defaultValue={[field.value]}
              min={5}
              max={200}
              onValueChange={(value) => {
                field.onChange(value[0]);
              }}
            />

            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </form>
  );
}
