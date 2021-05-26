## Description

JSON storage TCP Nest microservice with GraphQL syntax for extra small projects.

### Storage structure

```
data/space.token/entities/entityId.json
```

### Microservice usage

Define provider
```
@Module({
  ...
  providers: [
    ...
    {
      provide: 'STORAGE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: storage_host,
            port: storage_port,
          }
        })
      }
    },
    ...
  ],
  ...
})
```

Inject and use
```
export class AppService {
  constructor(
    ...
    @Inject('STORAGE') private storageProxy: ClientProxy,
    ...
  ) {
    storageProxy.connect();
  }

  async getAuthors(section: string) {
    return await this.storageProxy.send('query', {
      space: 'library',
      token: storage_token,
      query: `{ allAuthors(page: 1, take: 10, sortField: "id", filter: { name_in: "Mike" }) { id, name, Books { id } } }`,
    }).toPromise();
  }

  async createAuthor(section: string) {
    return await this.storageProxy.send('query', {
      space: 'library',
      token: storage_token,
      query: `mutation { createAuthor(name: "John") { id, name } }`,
    }).toPromise();
  }
}
```

### Supported query parameters

* page: Number
* take: Number
* distinct: String
* sortField: String
* sortOrder: asc, desc, rnd

### Supported query filters

* q - full-text filter
* _neq - not equal
* _lte - less than or equal
* _gte - greater than or equal
* _lt - less than
* _gt - greater than
* _in - includes

### Supported mutations

* createEntity
* createManyEntity
* updateEntity
* removeEntity

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker-compose

```
version: "3.8"
services:
  storage:
    image: flatrow/storage
    volumes:
      - ./storage:/app/dist/data
    ports:
      - 3000:3000
```

## References

Powered by [Nest.js](https://nestjs.com) framework.

Containerized with [Docker](https://www.docker.com) platform.

GraphQL implementation based on [marmelab/json-graphql-server](https://github.com/marmelab/json-graphql-server).

## License

[MIT licensed](LICENSE).