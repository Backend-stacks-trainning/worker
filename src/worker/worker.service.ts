import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

interface ISendEvent {
  msg: string;
  data: object;
}

@Injectable()
export class WorkerService {
  constructor(private readonly esService: ElasticsearchService) {}

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'todo_created',
  })
  public async todoCreatedHandler(payload: ISendEvent) {
    console.log(`Received message: ${payload.msg}`);

    await this.indexTodo(payload.data);
  }

  // Create index
  public async createIndex() {
    const index = 'todo';
    const checkIndex = await this.esService.indices.exists({ index });

    if (!checkIndex) {
      await this.esService.indices.create({
        index,
        body: {
          mappings: {
            properties: {
              title: {
                type: 'text',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
              title_keyword: {
                type: 'keyword',
              },
            },
          },
        },
      });
    }
  }

  // Add todo to ES
  public async indexTodo(todo: any) {
    return await this.esService.index({
      index: 'todo',
      body: todo,
    });
  }
}
