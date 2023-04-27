import { Module, OnModuleInit } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { WorkerService } from './worker.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'exchange1',
          type: 'topic',
        },
      ],
      uri: 'amqp://localhost:5672',
      connectionInitOptions: { wait: false },
    }),
    ElasticsearchModule.registerAsync({
      useFactory: async () => ({
        cloud: {
          id: 'tuannt02-elasticsearch:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQ5YWY5NTExYmY2YTQ0MzdlOGU2YWUzODBjNTc1YTE0OSRmM2ZiNjNmZDJmZmY0NGEyYjJiMjE2YTEyMjE2Y2FmYQ==',
        },
        auth: {
          username: 'elastic',
          password: '6mGdrrDqKUBMCysKeu61xaby',
        },
      }),
    }),
  ],
  providers: [WorkerService],
  exports: [ElasticsearchModule],
})
export class WorkerModule implements OnModuleInit {
  constructor(private readonly searchService: WorkerService) {}
  public async onModuleInit() {
    await this.searchService.createIndex();
  }
}
