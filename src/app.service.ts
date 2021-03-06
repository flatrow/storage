import { readdirSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { graphql } from 'graphql';
import { Injectable } from '@nestjs/common';
import schemaBuilder from './graphql/schemaBuilder';
import { getMutationSubject, onCreate, onRemove, onUpdate } from './mutationApplier';

@Injectable()
export class AppService {
  protected spaces;

  constructor() {
    if (!existsSync(join(__dirname, 'data'))) {
      mkdirSync(join(__dirname, 'data'));
    }

    this.spaces = Object.fromEntries(
      readdirSync
        (join(__dirname, 'data'), { withFileTypes: true })
        .filter(space => space.isDirectory())
        .map(space => [
          space.name,
          schemaBuilder(
            Object.fromEntries(
              readdirSync
                (join(__dirname, 'data', space.name), { withFileTypes: true })
                .filter(entity => entity.isDirectory())
                .map(entity => [
                  entity.name,
                  readdirSync(join(__dirname, 'data', space.name, entity.name), { withFileTypes: true })
                    .filter(item => item.isFile() && item.name !== '.DS_Store')
                    .map(item => {
                      try {
                        return JSON.parse(
                          readFileSync(join(__dirname, 'data', space.name, entity.name, item.name), { encoding: 'utf8' })
                        )
                      } catch { }
                    })
                    .filter(item => item)
                ])
                .filter(entity => (console.log(`For space ${space.name} loaded ${entity[1].length} ${entity[0]}`), entity))
            ),
            {
              createSubject: getMutationSubject(space.name, onCreate),
              updateSubject: getMutationSubject(space.name, onUpdate),
              removeSubject: getMutationSubject(space.name, onRemove),
            }
          )
        ])
    );
  }

  async process(query) {
    return await graphql(this.spaces[`${query.space}.${query.token}`], query.query)
  }
}
