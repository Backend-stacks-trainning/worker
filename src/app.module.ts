import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkerModule } from './worker/worker.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // External module
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Internal module
    WorkerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
