export default function () {
    this.get('/people', (schema, request) => {
        const keyword = request.queryParams['filter[keyword]'];
        const offset = request.queryParams['page[offset]'];
        const limit = request.queryParams['page[limit]'];
        return schema.people.where((person) => person.name.includes(keyword)).slice(offset, offset + limit);
    });
    this.passthrough();
}
