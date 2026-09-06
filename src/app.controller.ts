import { Controller, Get, Res } from '@nestjs/common';
import * as express from 'express';

@Controller()
export class AppController {
  @Get()
  redirectHome(@Res() res: express.Response) {
    return res.redirect('/api');
  }
}