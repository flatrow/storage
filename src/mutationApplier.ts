import { writeFile, unlink } from 'fs';
import { join } from 'path';
import { Subject } from 'rxjs';

export function getMutationSubject(space, onNext) {
    const subject = new Subject();
    subject.subscribe(onNext.bind(undefined, space));
    return subject;
}

export function onCreate(space, [entityCollection, entity]) {
    writeFile(
        join(__dirname, 'data', space, entityCollection, `${entity.id}.json`),
        JSON.stringify(entity),
        { encoding: 'utf8' },
        (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`In space ${space} into collection ${entityCollection} was added entity ${entity.id}`);
            }
        }
    );
}

export function onUpdate(space, [entityCollection, entity]) {
    writeFile(
        join(__dirname, 'data', space, entityCollection, `${entity.id}.json`),
        JSON.stringify(entity),
        { encoding: 'utf8' },
        (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`In space ${space} within collection ${entityCollection} was updated entity ${entity.id}`);
            }
        }
    );
}

export function onRemove(space, [entityCollection, entity]) {
    unlink(
        join(__dirname, 'data', space, entityCollection, `${entity.id}.json`),
        (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`In space ${space} from collection ${entityCollection} was removed entity ${entity.id}`);
            }
        }
    );
}
