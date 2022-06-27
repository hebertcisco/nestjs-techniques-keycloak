[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/hebertcisco/nestjs-rest-boilerplate)

[![Node.js CI](https://github.com/hebertcisco/nestjs-rest-boilerplate/actions/workflows/node.js.yml/badge.svg)](https://github.com/hebertcisco/nestjs-rest-boilerplate/actions/workflows/node.js.yml)

[![Docker Image CI](https://github.com/hebertcisco/nestjs-rest-boilerplate/actions/workflows/docker-image.yml/badge.svg)](https://github.com/hebertcisco/nestjs-rest-boilerplate/actions/workflows/docker-image.yml)

# Basic documentation

### Usage example:

```ts
// user.module.ts
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakModule } from 'nest-keycloak-middleware';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { configService } from '../../infra/application/application.config';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        KeycloakModule.register({
            realm: configService.getValue('KEYCLOAK_REALM', true),
            authServerUrl: configService.getValue('KEYCLOAK_URL', true),
            clientId: configService.getValue('KEYCLOAK_CLIENT_ID', true),
            clientSecret: configService.getValue(
                'KEYCLOAK_CLIENT_SECRET',
                true,
            ),
            username: configService.getValue('KEYCLOAK_ADMIN', true),
            password: configService.getValue('KEYCLOAK_ADMIN_PASSWORD', true),
        }),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
```

In your user.service.ts import the KeycloakService:

```ts
// user.service.ts
 import { KeycloakService } from 'nest-keycloak-middleware';
```

In your constructor pass the KeycloakService instance

```ts
// user.service.ts
 constructor(private readonly keycloakService: KeycloakService) {}
```

Create the interface, taking the necessary data

```ts
// create-user.dto.ts
export class CreateUserDto {
    @ApiProperty({ required: true, default: chance.name() })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ required: true, default: chance.name() })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ required: true, default: chance.email() })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ required: true, default: '123456' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
```

As an example, use your keycloack context and create the user right away.

```ts
// user.service.ts
 public async create(createUserDto: CreateUserDto) {
        try {
            const passwordHash = await bcrypt.hash(createUserDto.password, 8);
            const user = this.userRepository.create({
                ...createUserDto,
                password: passwordHash,
            });
            const ctx = this.keycloakService.createKeycloakCtx();

            return ctx.users
                .create({
                    ...createUserDto,
                    username: user.id,
                    password: passwordHash,
                    enabled: true,
                })
                .then(() => this.userRepository.save(user))
                .catch((error) => error);
        } catch (error) {
            throw error;
        }
    }
```

## Postgres with Docker

> Up an image and run postgres image with docker

```sh
docker run --name db_pg -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -d postgres:11
```

```sh
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:18.0.2 start-dev
```

## Environment variables

> Create a `.env` file in the root directory of your project

```dotenv
# APP CONFIGURATION
PORT=3333                  # default port to listen
APP_SECRET='strong-secret' #x-api-key
NODE_ENV="development"     #development or production

# POSTGRES DATABASE
POSTGRES_DATABASE="postgres" # database name
POSTGRES_HOST="127.0.0.1"    # database host
POSTGRES_USER="postgres"     # database user
POSTGRES_PASSWORD="postgres" # database password
POSTGRES_PORT=5432           # default
POSTGRES_SYNC=true           # boolean
POSTGRES_LOGS=true           # boolean

# keycloak
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin
KEYCLOAK_URL=http://localhost
KEYCLOAK_REALM=admin
KEYCLOAK_CLIENT_ID=admin_client
KEYCLOAK_CLIENT_SECRET=sEc3t
KEYCLOAK_JWT_KEY="-----BEGIN PUBLIC KEY-----\n key \n-----END PUBLIC KEY-----"
```

## Runing the application with docker

### Run as dev

```sh
docker-compose up dev
```

### Run as prod

```sh
docker-compose up -d prod
```

## Runing the application with npm scrips

```sh
npm install && npm run build
```

```sh
npm run prepare:enviroment
```

### Run as dev

```sh
npm run dev
```

or

```sh
npm run dev:test
```

### Run as prod

```sh
npm run start
```

or

```sh
npm run start:prod
```
