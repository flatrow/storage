import getFieldsFromEntities from '../../introspection/getFieldsFromEntities';
import {
    getRelatedKey,
    getRelatedType,
    getRelationshipFromKey,
    getReverseRelatedField,
} from '../../nameConverter';
import { isRelationshipField } from '../../relationships';

/**
 * Add resolvers for relationship fields
 *
 * @example
 * Consider this data:
 *
 *     {
 *         posts: [
 *              { id: 1, title: 'Hello, world', userId: 123 }
 *         ],
 *         users: [
 *              { id: 123, name: 'John Doe' }
 *         ]
 *         comments: [
 *              { id: 4646, postId: 1, body: 'Nice post!' }
 *         ]
 *     }
 *
 * There are two relationship fields here, posts.userId and comments.postId.
 * The generated GraphQL schema for posts is:
 *
 *     type Post {
 *         id: ID!
 *         title: String
 *         userId: ID
 *         User: User
 *         Comments: [Comment]
 *     }
 *
 * When called for the posts entity, this method generates resolvers
 * for Post.User and Post.Comments
 *
 * @param {String} entityName The entity key in the data map, e.g. "posts"
 * @param {Object} data The entire data map, e.g. { posts: [], users: [] }
 *
 * @return {Object} resolvers, e.g.
 *
 *     {
 *         Post: {
 *             User: (post) => users.find(user => user.id == post.userId),
 *             Comments: (post) => comments.filter(comment => comment.postId = post.id),
 *         },
 *     }
 */
export default (entityName, data) => {
    const entityFields = Object.keys(getFieldsFromEntities(data[entityName]));
    const manyToOneResolvers = entityFields.filter(isRelationshipField).reduce(
        (resolvers, fieldName) =>
            Object.assign({}, resolvers, {
                [getRelatedType(fieldName)]: (entity) =>
                    data[getRelatedKey(fieldName)].find(
                        (relatedRecord) => relatedRecord.id == entity[fieldName]
                    ),
            }),
        {}
    );
    const relatedField = getReverseRelatedField(entityName); // 'posts' => 'postId'

    const hasReverseRelationship = (entityName) =>
        Object.keys(getFieldsFromEntities(data[entityName])).includes(
            relatedField
        );

    const entities = Object.keys(data);
    const oneToManyResolvers = entities.filter(hasReverseRelationship).reduce(
        (resolvers, entityName) =>
            Object.assign({}, resolvers, {
                [getRelationshipFromKey(entityName)]: (entity) =>
                    data[entityName].filter(
                        (record) => record[relatedField] == entity.id
                    ),
            }),
        {}
    );

    return Object.assign({}, manyToOneResolvers, oneToManyResolvers);
};
