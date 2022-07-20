import Person from '../app/models/person';

// interface Schema {
//     [x: string]: any;
// }

// interface Request {
//     [x: string]: any;
// }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function () {
    this.get('/people', (schema, request) => {
        const keyword = request.queryParams['filter[keyword]'];
        const offset = Number(request.queryParams['page[offset]']);
        const limit = Number(request.queryParams['page[limit]']);
        const people = schema.people.where((person) => person.name?.includes(keyword)).slice(offset, offset + limit);
        if (!people.length) {
            for (let i = offset; i < offset + limit; i++) {
                schema.people.create({ name: `person ${i}`, dob: new Date(Math.floor(Math.random() * 1000000000000)) });
            }
            return schema.people.where((person) => person.name?.includes(keyword)).slice(offset, offset + limit);
        }
        return people;
    });
    this.passthrough();
}
