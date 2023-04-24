import { Module, OnModuleInit } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';

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
        node: 'https://tuannt02-elasticsearch.es.us-central1.gcp.cloud.es.io/',
        auth: {
          username: 'elastic',
          password: '6mGdrrDqKUBMCysKeu61xaby',
        },
      }),
    }),
  ],
  providers: [SearchService],
  exports: [ElasticsearchModule],
})
export class SearchModule implements OnModuleInit {
  constructor(private readonly searchService: SearchService) {}
  public async onModuleInit() {
    await this.searchService.createIndex();
  }
}
