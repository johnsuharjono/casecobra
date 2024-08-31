import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { Pool } from '@neondatabase/serverless'
import { drizzle as drizzleServerless } from 'drizzle-orm/neon-serverless'

config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL!)
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(sql)
export const dbPool = drizzleServerless(pool)
