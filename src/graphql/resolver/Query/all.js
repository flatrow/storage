import applyFilters from './applyFilters';

export default (entityData = []) => (
    _,
    { sortField, sortOrder = 'asc', page, take = 25, filter = {}, distinct = '' }
) => {
    let items = [...entityData];

    if (sortOrder.toLowerCase() == 'rnd') {
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
    }
    else if (sortField) {
        const direction =  sortOrder.toLowerCase() == 'asc' ? 1 : -1;
        items = items.sort((a, b) => {
            if (a[sortField] > b[sortField]) {
                return direction;
            }
            if (a[sortField] < b[sortField]) {
                return -1 * direction;
            }
            return 0;
        });
    }

    console.log(`${items.length} entities count before filtering`);
    items = applyFilters(items, filter);
    console.log(`${items.length} entities count after filtering`);

    if (distinct) {
        distinct = distinct.split(' ');
        items = items.reduce((results, item) => {
            if (!distinct.every(d => results.some(result => result[d] === item[d]))) {
                return [...results, item];
            } else {
                return results;
            }
        }, []);
        console.log(`${items.length} entities count after distinct`);
    }

    if (take) {
        items = items.slice((page || 0) * take, (page || 0) * take + take);
    }

    return items;
};
