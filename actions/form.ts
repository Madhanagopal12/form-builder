"use server";

import { formSchema, formSchemaType } from "@/components/schema/form";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { useRect } from "@dnd-kit/core/dist/hooks/utilities";
import { User } from "lucide-react";
import { RiH1 } from "react-icons/ri";
import { FormElement } from "@/components/FormElements";
import { redirect } from "next/navigation";

// class UsernotFoundErr extends Error {
//   constructor() {
//     super("User not found");
//   }
// }

export async function GetFormStats() {
  const user = await currentUser();

  if (!user) {
    // throw new UsernotFoundErr();
    // throw new Error("User not Found");
    return null;
  }

  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return { visits, submissions, bounceRate, submissionRate };
}

export async function CreateForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data);

  if (!validation) throw new Error("Form is not valid");

  const user = await currentUser();

  if (!user) {
    throw new Error("User not Found ");
  }

  const { name, description } = data;

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name,
      description,
    },
  });

  if (!form) throw new Error("Something went wrong");

  return form.id;
}

export async function GetForms() {
  const user = await currentUser();

  if (!user) {
    // throw new Error("User not found");
    return null;
  }

  return await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createatedAt: "desc",
    },
  });
}

export async function GetFormById(id: number) {
  const user = await currentUser();

  if (!user) {
    // throw new Error("User not found");
    return null;
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });
}

export async function UpdateFormContent(id: number, jsonContent: string) {
  const user = await currentUser();

  if (!user) {
    // throw new Error("User not found");
    return null;
  }

  return await prisma.form.update({
    where: {
      userId: user.id,
      id,
    },
    data: {
      content: jsonContent,
    },
  });
}

export async function PublishForm(id: number) {
  const user = await currentUser();

  if (!user) {
    // throw new Error("User not found");
    return null;
  }

  return await prisma.form.update({
    data: {
      published: true,
    },
    where: {
      userId: user.id,
      id,
    },
  });
}

export async function GetFormContentByUrl(formUrl: string) {
  return await prisma.form.update({
    select: {
      content: true,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
    where: {
      shareURL: formUrl,
    },
  });
}

export async function SubmitForm(formUrl: string, content: string) {
  return await prisma.form.update({
    data: {
      submissions: {
        increment: 1,
      },
      formSubmissions: {
        create: {
          content,
        },
      },
    },
    where: {
      shareURL: formUrl,
      published: true,
    },
  });
}

export async function GetFormWithSubmissions(id: number) {
  const user = await currentUser();

  if (!user) {
    // throw new Error("User not found");
    return null;
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
    include: {
      formSubmissions: true,
    },
  });
}
