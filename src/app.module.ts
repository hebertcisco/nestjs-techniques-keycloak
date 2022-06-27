import {
    Module,
    NestModule,
    MiddlewareConsumer,
    RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesMiddleware } from './infra/auth/roles.middleware';

import { UserModule } from './modules/user/user.module';
import { typeormConfig } from './infra/database/typeorm/typeorm.config';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeormConfig.getTypeOrmConfig()),
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RolesMiddleware)
            .exclude(
                { path: 'status', method: RequestMethod.GET },
                { path: '/', method: RequestMethod.GET },
            )
            .forRoutes('*');
    }
}
