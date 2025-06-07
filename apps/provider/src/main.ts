import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ProviderModule } from './providers.module';



async function bootstrap() {
  const app = await NestFactory.create(ProviderModule);
  const configService = app.get(ConfigService)
  app.enableCors({});

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: "0.0.0.0",
      port: configService.get("PROVIDER_TCP_PORT")

    }
  })
  await app.startAllMicroservices()
  await app.listen(configService.get("PROVIDER_HTTP_PORT") as string, "0.0.0.0");
  console.log(`🚀 App listening on port ${process.env.PROVIDER_HTTP_PORT as string}`);
}
bootstrap();


