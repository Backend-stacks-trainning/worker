import { Module, OnModuleInit } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { WorkerService } from './worker.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        exchanges: [
          {
            name: 'exchange1',
            type: 'topic',
          },
        ],
        uri: configService.get<string>('RABBITMQ_URI'),
        connectionInitOptions: { wait: false },
      }),
    }),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get<string>('ES_URL'),
      }),
    }),
  ],
  providers: [WorkerService],
  exports: [ElasticsearchModule],
})
export class WorkerModule implements OnModuleInit {
  constructor(private readonly workerService: WorkerService) {}
  public async onModuleInit() {
    await this.workerService.createIndex();
  }
}
