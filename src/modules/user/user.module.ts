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
