import mysql, { Connection } from 'mysql2/promise';

let connection: Connection | undefined;

export const createConnection = async (): Promise<Connection> => {
  if (connection) {
    return connection;
  }

  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  return connection;
};


