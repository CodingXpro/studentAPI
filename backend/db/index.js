import { Pool } from 'pg';


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'studentdb',
  password: 'admin1',
  port: 5432,
});

export default pool;