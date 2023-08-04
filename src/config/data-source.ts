import {DataSource} from 'typeorm';

export default new DataSource({
   type: 'mssql',
   host: 'localhost',
   port: 1433,
   username: 'sa',
   password: '123',
   database: 'social_network',
   synchronize: false,
   logging: false,
   entities: ['src/models/**/*.ts'],
   subscribers: [],
   migrations: ['src/migrations/**/*.ts'],
   options: {
      trustServerCertificate: true,
   },
});
