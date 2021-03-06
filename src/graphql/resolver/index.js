import { pluralize } from 'inflection';
import GraphQLJSON from 'graphql-type-json';

import all from './Query/all';
import meta from './Query/meta';
import single from './Query/single';
import create from './Mutation/create';
import createMany from './Mutation/createMany';
import update from './Mutation/update';
import remove from './Mutation/remove';
import entityResolver from './Entity';
import { getTypeFromKey } from '../nameConverter';
import DateType from '../introspection/DateType';
import hasType from '../introspection/hasType';

const getQueryResolvers = (entityName, data) => ({
    [`all${pluralize(entityName)}`]: all(data),
    [`_all${pluralize(entityName)}Meta`]: meta(data),
    [entityName]: single(data),
});

const getMutationResolvers = (entityCollection, entityName, data, options) => ({
    [`create${entityName}`]: create(entityCollection, data, options.createSubject),
    [`createMany${entityName}`]: createMany(entityCollection, data, options.createSubject),
    [`update${entityName}`]: update(entityCollection, data, options.updateSubject),
    [`remove${entityName}`]: remove(entityCollection, data, options.removeSubject),
});

export default (data, options) => {
    return Object.assign(
        {},
        {
            Query: Object.keys(data).reduce(
                (resolvers, key) =>
                    Object.assign(
                        {},
                        resolvers,
                        getQueryResolvers(getTypeFromKey(key), data[key])
                    ),
                {}
            ),
            Mutation: Object.keys(data).reduce(
                (resolvers, key) =>
                    Object.assign(
                        {},
                        resolvers,
                        getMutationResolvers(key, getTypeFromKey(key), data[key], options)
                    ),
                {}
            ),
        },
        Object.keys(data).reduce(
            (resolvers, key) =>
                Object.assign({}, resolvers, {
                    [getTypeFromKey(key)]: entityResolver(key, data),
                }),
            {}
        ),
        hasType('Date', data) ? { Date: DateType } : {}, // required because makeExecutableSchema strips resolvers from typeDefs
        hasType('JSON', data) ? { JSON: GraphQLJSON } : {} // required because makeExecutableSchema strips resolvers from typeDefs
    );
};
