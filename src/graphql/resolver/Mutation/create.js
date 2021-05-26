export default (entityCollection, entityData = [], subject = undefined) => (_, entity) => {
    console.log(entity);
    const newId =
        entityData.length > 0 ? entityData[entityData.length - 1].id + 1 : 0;
    const newEntity = Object.assign({}, entity, { id: newId });
    entityData.push(newEntity);
    if (subject && subject.next)
        subject.next([entityCollection, newEntity]);
    return newEntity;
};
