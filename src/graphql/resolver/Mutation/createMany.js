import create from './create';

export default (entityCollection, entityData = [], subject = undefined) => (_, entities) => {
    return entities.data.map((e) => create(entityCollection, entityData, subject)(null, e));
};
