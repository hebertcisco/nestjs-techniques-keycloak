const { join } = require('node:path');
const { execSync } = require('node:child_process');
const dotenv = require('dotenv');

dotenv.config();

const directoryToWork = `${join(__dirname, '..')}`;

execSync(`cp ${directoryToWork}/.env.example ${directoryToWork}/.env`);

const { POSTGRES_PASSWORD, POSTGRES_USER } = process.env;

execSync(
    `docker run --name db_pg -p 5432:5432 -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} -e POSTGRES_USER=${POSTGRES_USER} -d postgres:11`,
);
