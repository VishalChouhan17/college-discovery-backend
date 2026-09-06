import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  health() {
    return {
      status: 'healthy',
      message: 'College Discovery Backend is running',
      swaggerDocs: 'Visit /api for API documentation',
      endpoints: {
        colleges: 'GET /colleges',
        auth: 'POST /auth/register or /auth/login',
        saved: 'GET/POST /saved/colleges',
        questions: 'GET /questions',
      },
    };
  }
}