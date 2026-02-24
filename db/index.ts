import { drizzle } from 'drizzle-orm/neon-serverless';
import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from './schema';

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl.includes('placeholder')) {
  console.warn(
    '\n⚠️  DATABASE_URL is not configured. API routes requiring the database will fail.\n' +
    '   Set DATABASE_URL in your .env file to enable full functionality.\n'
  );
}

// Create a pool — connection errors will surface at query time, not at startup
export const pool = databaseUrl && !databaseUrl.includes('placeholder')
  ? new Pool({ connectionString: databaseUrl })
  : null as any;

export const db = pool
  ? drizzle(pool, { schema })
  : new Proxy({} as ReturnType<typeof drizzle>, {
    get: () => () => { throw new Error('Database not configured. Set DATABASE_URL in .env'); }
  });
