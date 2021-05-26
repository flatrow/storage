export default (entityCollection, entityData = [], subject = undefined) => (_, { id }) => {
    let removedEntity = undefined;
    if (id != null) {
        const stringId = id.toString();
        const indexOfEntity = entityData.findIndex(
            (e) => e.id != null && e.id.toString() === stringId
        );

        if (indexOfEntity !== -1) {
            removedEntity = entityData.splice(indexOfEntity, 1)[0];
            if (subject && subject.next)
                subject.next([entityCollection, removedEntity]);
        }
    }
    return removedEntity;
};
