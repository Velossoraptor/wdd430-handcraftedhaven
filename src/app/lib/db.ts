
import postgres from 'postgres';


let sql: ReturnType<typeof postgres>;

if (process.env.NODE_ENV === 'production') {
  
  sql = postgres(process.env.DATABASE_URL!, {
    ssl: { rejectUnauthorized: false },
    idle_timeout: 20,
    max_lifetime: 60 * 30,
  });
} else {
  
  if (!global._postgres) {
    global._postgres = postgres(process.env.DATABASE_URL!, {
      ssl: { rejectUnauthorized: false },
      idle_timeout: 20,
      max_lifetime: 60 * 30,
    });
  }
  sql = global._postgres;
}

// TypeScript declaration for global
declare global {
  var _postgres: ReturnType<typeof postgres> | undefined;
}

export default sql;