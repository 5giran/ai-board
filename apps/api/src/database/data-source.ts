import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { createDataSourceOptions } from '../config/typeorm.config';

export default new DataSource(createDataSourceOptions());
