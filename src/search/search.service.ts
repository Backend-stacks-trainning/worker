import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly esService: ElasticsearchService) {}

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'todo_created',
  })
  public async pubSubHandler(msg: any) {
    console.log(`Received message: ${JSON.stringify(msg)}`);
  }

  // Create index
  public async createIndex() {
    const index = 'tuannt02';
    const checkIndex = await this.esService.indices.exists({ index });
    // tslint:disable-next-line:early-exit
    this.esService.indices.create({
      index,
      body: {
        mappings: {
          properties: {
            email: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },
            tags: {
              properties: {
                tag: {
                  type: 'text',
                  fields: {
                    keyword: {
                      type: 'keyword',
                      ignore_above: 256,
                    },
                  },
                },
              },
            },
            text: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },
            title: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },
          },
        },
        settings: {
          analysis: {
            filter: {
              autocomplete_filter: {
                type: 'edge_ngram',
                min_gram: 1,
                max_gram: 20,
              },
            },
            analyzer: {
              autocomplete: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'autocomplete_filter'],
              },
            },
          },
        },
      },
    });
  }
}
