import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

import { db } from '@/db'
import { configurations } from '@/db/schema'

import { DesignConfigurator } from './design-configurator'

interface PageProps {
	searchParams: {
		[key: string]: string | string[] | undefined
	}
}

export default async function DesignPage({ searchParams }: PageProps) {
	const { id } = searchParams

	if (!id || typeof id !== 'string') {
		return notFound()
	}

	const [configuration] = await db
		.select()
		.from(configurations)
		.where(eq(configurations.id, id))

	if (!configuration) {
		return notFound()
	}

	const { imageUrl, width, height } = configuration

	return (
		<DesignConfigurator
			configId={id}
			imageUrl={imageUrl}
			imageDimensions={{ width, height }}
		/>
	)
}
