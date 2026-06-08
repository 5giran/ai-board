import { join } from 'node:path';

import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { DataSourceOptions } from 'typeorm';

export function createDataSourceOptions(
  env: NodeJS.ProcessEnv = process.env,
): DataSourceOptions {
  const url = env.DATABASE_URL;
  const connectionOptions = url
    ? { url }
    : {
        host: env.DB_HOST ?? 'localhost',
        port: Number(env.DB_PORT ?? 5432),
        username: env.DB_USERNAME ?? 'ai_board',
        password: env.DB_PASSWORD ?? 'ai_board_password',
        database: env.DB_DATABASE ?? 'ai_board',
      };

  return {
    type: 'postgres',
    ...connectionOptions,
    synchronize: false,
    logging: env.DB_LOGGING === 'true',
    entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
  };
}

export function createTypeOrmOptions(
  env: NodeJS.ProcessEnv = process.env,
): TypeOrmModuleOptions {
  return {
    ...createDataSourceOptions(env),
    autoLoadEntities: true,
  };
}
