import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { Phone } from '@/components/phone'
import { CheckIcon, StarFilledIcon } from '@radix-ui/react-icons'
import Image from 'next/image'

export default function Home() {
	return (
		<div className='bg-slate-50'>
			<MaxWidthWrapper className='pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52'>
				<div className='col-span-2 px-6 lg:px-0 lg:pt-4'>
					<div className='relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start'>
						<div className='absolute w-28 left-0 -top-20 hidden lg:block'>
							<div className='absolute inset-x-0 bottom-0 bg-gradient-to-t via-slate-50/50 from-slate-50 h-28' />
							<Image src='/snake-1.png' width={112} height={112} alt='Snake' />
						</div>
						<h1 className='relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl'>
							Your Image on a{' '}
							<span className='bg-blue-600 px-2 text-white'>Custom</span> Phone
							Case
						</h1>
						<p className='mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap'>
							Capture your favorite memories with your own,{' '}
							<span className='font-semibold'>one-of-one</span> phone case. Case
							Cobra allows you to protect your memories, not just your phone
							case.
						</p>

						<ul className='mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start'>
							<div className='space-y-2'>
								<li className='flex gap-1.5 items-center text-left'>
									<CheckIcon className='h-5 w-5 shrink-0 text-blue-600' />
									High-quality, durable material
								</li>
								<li className='flex gap-1.5 items-center text-left'>
									<CheckIcon className='h-5 w-5 shrink-0 text-blue-600' />5
									years print guarantee
								</li>
								<li className='flex gap-1.5 items-center text-left'>
									<CheckIcon className='h-5 w-5 shrink-0 text-blue-600' />
									Modern iPhone models supported
								</li>
							</div>
						</ul>

						<div className='mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5'>
							<div className='flex -space-x-4'>
								<Image
									height={40}
									width={40}
									className='inline-block rounded-full ring-2 ring-slate-100'
									src={'/users/user-1.png'}
									alt='user image'
								/>
								<Image
									height={40}
									width={40}
									className='inline-block rounded-full ring-2 ring-slate-100'
									src={'/users/user-2.png'}
									alt='user image'
								/>
								<Image
									height={40}
									width={40}
									className='inline-block rounded-full ring-2 ring-slate-100'
									src={'/users/user-3.png'}
									alt='user image'
								/>
								<Image
									height={40}
									width={40}
									className='inline-block rounded-full ring-2 ring-slate-100'
									src={'/users/user-4.jpg'}
									alt='user image'
								/>
								<Image
									height={40}
									width={40}
									className='inline-block rounded-full ring-2 ring-slate-100 object-cover'
									src={'/users/user-5.jpg'}
									alt='user image'
								/>
							</div>

							<div className='flex flex-col justify-between items-center sm:items-start'>
								<div className='flex gap-0.5'>
									<StarFilledIcon
										height={16}
										width={16}
										className='text-blue-600'
									/>
									<StarFilledIcon
										height={16}
										width={16}
										className='text-blue-600'
									/>
									<StarFilledIcon
										height={16}
										width={16}
										className='text-blue-600'
									/>
									<StarFilledIcon
										height={16}
										width={16}
										className='text-blue-600'
									/>
									<StarFilledIcon
										height={16}
										width={16}
										className='text-blue-600'
									/>
								</div>

								<p>
									<span className='font-semibold'>1.250</span> happy customers
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className='col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit'>
					<div className='relative md:max-w-xl'>
						<img
							alt='your image'
							src='/your-image.png'
							className='absolute w-40 lg:w-52 left-56 -top-20 select-none hidden sm:block lg:hidden xl:block'
						/>

						<img
							src='/line.png'
							alt='line'
							className='absolute w-20 -left-6 -bottom-6 select-none'
						/>

						<Phone className='w-64' imgSrc='/testimonials/1.jpg' />
					</div>
				</div>
			</MaxWidthWrapper>
		</div>
	)
}
