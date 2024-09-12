'use client'

import { Button } from '@/components/ui/button'
import { OrderStatus } from '@/db/schema'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { changeOrderStatus } from './action'
import { useRouter } from 'next/navigation'

const LABEL_MAP: Record<OrderStatus, string> = {
  fullfilled: 'Fullfilled',
  shipped: 'Shipped',
  awaiting_shipment: 'Awaiting shipment',
}

export function StatusDropdown({
  id,
  orderStatus,
}: {
  id: string
  orderStatus: OrderStatus
}) {
  const router = useRouter()

  const { mutate } = useMutation({
    mutationKey: ['change-order-status'],
    mutationFn: changeOrderStatus,
    onSuccess: () => router.refresh(),
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'outline'}
          className='flex w-52 items-center justify-between'
        >
          {LABEL_MAP[orderStatus]}
          <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-0'>
        {Object.keys(LABEL_MAP).map((status) => (
          <DropdownMenuItem
            onClick={() => mutate({ id, newStatus: status as OrderStatus })}
            key={status}
            className={cn(
              'flex cursor-default items-center gap-1 p-2.5 text-sm hover:bg-zinc-100',
              {
                'bg-zinc-100': orderStatus === status,
              },
            )}
          >
            <Check
              className={cn(
                'mr-2 size-4 text-primary',
                orderStatus === status ? 'opacity-100' : 'opacity-0',
              )}
            />
            {LABEL_MAP[status as OrderStatus]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
