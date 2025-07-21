// ormconfig.ts
import { Product } from 'src/db/entities/product.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'WXuKXTrjLzLc1BP',
  database: process.env.DB_NAME || 'postgres',
  entities: [Product],
  migrations: ['dist/src/migrations/*.js'],
});
