import { db } from '@/db'
import { configurations } from '@/db/schema'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { z } from 'zod'
import sharp from 'sharp'
import { eq } from 'drizzle-orm'

const f = createUploadthing()

export const ourFileRouter = {
	imageUploader: f({ image: { maxFileSize: '4MB' } })
		.input(
			z.object({
				configId: z.string().optional(),
			})
		)
		.middleware(async ({ input }) => {
			return { input }
		})
		.onUploadComplete(async ({ metadata, file }) => {
			const { configId } = metadata.input
			const res = await fetch(file.url)
			const buffer = await res.arrayBuffer()
			const imgMetadata = await sharp(buffer)
			const { width, height } = await imgMetadata.metadata()

			if (!configId) {
				const [configuration] = await db
					.insert(configurations)
					.values({
						width: width || 500,
						height: height || 500,
						imageUrl: file.url,
					})
					.returning()

				return { configId: configuration.id }
			} else {
				const [updatedConfiguration] = await db
					.update(configurations)
					.set({
						croppedImageUrl: file.url,
					})
					.where(eq(configurations.id, configId))
					.returning()

				return { configId: updatedConfiguration.id }
			}
		}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
