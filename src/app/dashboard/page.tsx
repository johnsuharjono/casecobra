import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { formatPrice } from '@/lib/utils'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { and, desc, eq, gte, sql } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { StatusDropdown } from './status-dropdown'

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL

  if (!user || user.email !== ADMIN_EMAIL) {
    return notFound()
  }

  const ordersData = await db.query.orders.findMany({
    where: and(
      eq(orders.isPaid, true),
      gte(
        orders.createdAt,
        new Date(new Date().setDate(new Date().getDate() - 7)),
      ),
    ),
    with: {
      billingAddress: true,
      configuration: true,
      shippingAddress: true,
      user: true,
    },
    orderBy: [desc(orders.createdAt)],
  })

  const [lastWeekSum] = await db
    .select({
      _sum: sql<number>`SUM(${orders.amount})`,
    })
    .from(orders)
    .where(
      and(
        eq(orders.isPaid, true),
        gte(
          orders.createdAt,
          new Date(new Date().setDate(new Date().getDate() - 7)),
        ),
      ),
    )

  const [lastMonthSum] = await db
    .select({
      _sum: sql<number>`SUM(${orders.amount})`,
    })
    .from(orders)
    .where(
      and(
        eq(orders.isPaid, true),
        gte(
          orders.createdAt,
          new Date(new Date().setDate(new Date().getDate() - 30)),
        ),
      ),
    )

  const WEEKLY_GOAL = 100
  const MONTHLY_GOAL = 400

  return (
    <div className='flex min-h-screen w-full bg-muted/40'>
      <div className='mx-auto flex w-full max-w-7xl flex-col sm:gap-4 sm:py-4'>
        <div className='flex flex-col gap-16'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardDescription className='pb-2'>Last Month</CardDescription>
                <CardTitle className='text-4xl'>
                  {formatPrice(lastWeekSum._sum ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-sm text-muted-foreground'>
                  of {formatPrice(WEEKLY_GOAL)}
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  value={((lastWeekSum._sum ?? 0) / WEEKLY_GOAL) * 100}
                />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription className='pb-2'>Last Month</CardDescription>
                <CardTitle className='text-4xl'>
                  {formatPrice(lastMonthSum._sum ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-sm text-muted-foreground'>
                  of {formatPrice(MONTHLY_GOAL)}
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  value={((lastMonthSum._sum ?? 0) / MONTHLY_GOAL) * 100}
                />
              </CardFooter>
            </Card>
          </div>

          <h1 className='text-4xl font-bold tracking-tight'>Incoming orders</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className='hidden sm:table-cell'>Status</TableHead>
                <TableHead className='hidden sm:table-cell'>
                  Purchase Date
                </TableHead>
                <TableHead className='text-right'>Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {ordersData.map((order) => (
                <TableRow key={order.id} className='bg-accent'>
                  <TableCell>
                    <div className='font-medium'>
                      {order.shippingAddress?.name}
                    </div>
                    <div className='hidden text-sm text-muted-foreground md:inline'>
                      {order.user.email}
                    </div>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    <StatusDropdown id={order.id} orderStatus={order.status} />
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    {order.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className='text-right'>
                    {formatPrice(Number(order.amount))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
