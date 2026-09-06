import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    app.enableCors();

    // Swagger Setup
    const config = new DocumentBuilder()
      .setTitle('College Discovery API')
      .setDescription('API documentation for college discovery, comparison, and rank predictor')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Use PORT from environment variable (Render sets this)
    const port = process.env.PORT || 3000;
    await app.listen(port);
    
    console.log(`✅ Application running on: http://localhost:${port}`);
    console.log(`📚 Swagger Docs available at: http://localhost:${port}/api`);
    console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Connected' : 'NOT CONFIGURED - Set DATABASE_URL env var'}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Application failed to start:', errorMessage);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

bootstrap();
