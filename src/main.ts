import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.setGlobalPrefix('api/v0');

  const configService = new ConfigService();

  const port = configService.get('PORT') || 8080;

  const config = new DocumentBuilder()
    .addBearerAuth(undefined, 'default')
    .setTitle('Bitsonomy Assessment')
    .setDescription('The Bitsonomy Assessment API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      authAction: {
        default: {
          name: 'default',
          schema: {
            description: 'Default',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: configService.get('TOKEN'),
        },
      },
    },
  });

  await app.listen(port);
}
bootstrap();
