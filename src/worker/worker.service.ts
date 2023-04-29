import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

interface ISendEvent {
  msg: string;
  data: Todo;
}
interface Todo {
  todoId: string;
  title?: string;
  timestamp?: string;
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

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'todo_updated',
  })
  public async todoUpdatedHandler(payload: ISendEvent) {
    console.log(`Received message: ${payload.msg}`);

    await this.updateTodo(payload.data);
  }

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'todo_deleted',
  })
  public async todoDeletedHandler(payload: ISendEvent) {
    console.log(`Received message: ${payload.msg}`);

    await this.deleteTodo(payload.data);
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
                fielddata: true,
              },
            },
          },
        },
      });
    }
  }

  // Add todo to ES
  public async indexTodo(todo: Todo) {
    return await this.esService.index({
      index: 'todo',
      id: todo.todoId,
      body: { title: todo.title, timestamp: todo.timestamp },
    });
  }

  // Update todo to ES
  public async updateTodo(todo: Todo) {
    return await this.esService.update({
      index: 'todo',
      id: todo.todoId,
      body: {
        doc: {
          title: todo.title,
        },
      },
    });
  }

  // Delete todo to ES
  public async deleteTodo(todo: Todo) {
    return await this.esService.delete({
      index: 'todo',
      id: todo.todoId,
    });
  }
}
