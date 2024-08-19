import { db } from "@/db"
import { configurations } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { DesignPreview } from "./design-preview"

interface PreviewPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const { id } = searchParams

  if (!id || typeof id !== "string") {
    return notFound()
  }

  const configuration = await db
    .selectDistinct()
    .from(configurations)
    .where(eq(configurations.id, id))

  if (!configuration) {
    return notFound()
  }

  return <DesignPreview configuration={configuration[0]} />
}
