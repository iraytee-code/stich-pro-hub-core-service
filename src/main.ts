import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const { port, swaggerApiRoot } = configService.get('common');

  const PRODUCT_NAME = 'STICH PRO HUB service';
  const PRODUCT_TAG = 'STICH PRO HUB service';
  const PRODUCT_VERSION = '0.0.1';

  // allowed origins
  const whitelist = configService
    .get<string>('CORS_WHITELIST')
    .split(',')
    .map((pattern) => new RegExp(pattern));

  // enable localhost on dev/staging servers only
  if ([undefined, 'development', 'localhost'].includes(process.env.NODE_ENV)) {
    whitelist.push(/http(s)?:\/\/localhost:/);
  }

  Logger.log(`Approved domains: ${whitelist.join(',')}`);

  // set cors options
  const options = {
    origin: whitelist,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allwedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-control',
      'X-Api-Token',
    ],
    credentials: true,
  };

  app.enableCors(options);

  const swaggerOptions = new DocumentBuilder()
    .setTitle(`${PRODUCT_NAME} API Documentation`)
    .setDescription('List of all the APIs for Stitch Pro Hub services.')
    .setVersion(PRODUCT_VERSION)
    .addTag(PRODUCT_TAG)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(swaggerApiRoot, app, document);

  await app.listen(port);
  Logger.log(
    `${PRODUCT_NAME} core service running on port ${port}: visit http://localhost:${port}/${swaggerApiRoot}`,
  );
}
bootstrap();
