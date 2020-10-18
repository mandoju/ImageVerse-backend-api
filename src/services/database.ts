import { Sequelize } from 'sequelize';
import { getEnviromentDatabaseVariables } from '../utils/enviroment';

const {
  dbName,
  dbUsername,
  dbPassword,
  dbHost,
  dbPort
} = getEnviromentDatabaseVariables();
export const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres'
});
