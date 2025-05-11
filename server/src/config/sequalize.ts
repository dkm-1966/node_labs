import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME || 'tinder',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || 'root',
    {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
});

export default sequelize;