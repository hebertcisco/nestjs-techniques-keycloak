import { Controller, Get, HttpCode, Res } from '@nestjs/common';

import type { Response } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/')
    @HttpCode(302)
    index(@Res() res: Response) {
        res.redirect('/status');
    }
    @Get('/status')
    @HttpCode(200)
    info() {
        return this.appService.info();
    }
}
