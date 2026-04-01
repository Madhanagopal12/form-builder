"use client";

import { Form } from "@/lib/generated/prisma/client";
import PreviewDialogBtn from "./PreviewDialogBtn";
import SaveFormBtn from "./SaveFormBtn";
import PublishFormBtn from "./PublishFormBtn";
import FIle from "../public/file.svg";
import Designer from "./Designer";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "./DragOverlayWrapper";
import { useSession } from "@clerk/nextjs";
import { actionAsyncStorage } from "next/dist/server/app-render/action-async-storage.external";
import { useEffect, useState } from "react";
import useDesigner from "./hooks/useDesigner";
import { ImSpinner2 } from "react-icons/im";
import Confetti from "react-confetti";
import { Input } from "./ui/input";

function FormBuilder({ form }: { form: Form }) {
  const { setElements } = useDesigner();
  const [isReady, setIsReady] = useState(false);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    if (isReady) return;

    const elements = JSON.parse(form.content);
    setElements(elements);
    const readyTimeOut = setTimeout(() => setIsReady(true), 500);

    return () => clearTimeout(readyTimeOut);
  }, [form, setElements, isReady]);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <ImSpinner2 className="animate-spin h-12 w-12" />
      </div>
    );
  }

  const sharedUrl = `${window.location.origin}/submit/${form.shareURL}`;

  if (form.published) {
    return (
      <>
        <Confetti />
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="max-w-m">
            <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
              🎊🎊 Form Published 🎊🎊
            </h1>
            <h2 className="text-2xl">Share this form</h2>
            <h3 className="text-3xl text-muted-foreground border-b pb-10">
              Anyone with the link can view and submit the form.
            </h3>
            <div className="flex flex-col items-center gap-2 my-4 w-full border-b pb-4">
              <Input className="w-ful" readOnly value={sharedUrl} />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full">
        <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
          <h2 className="font-medium truncate">
            <span className="text-muted-foregro mr-2">Form: {form.name}</span>
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <SaveFormBtn id={form.id} />
                <PublishFormBtn id={form.id} />
              </>
            )}
          </div>
        </nav>

        <div className="flex w-full grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent paper-pattern">
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
}

export default FormBuilder;
