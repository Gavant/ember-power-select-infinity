// BEGIN-SNIPPET person.ts
import DS from 'ember-data';
import attr from 'ember-data/attr';

export default class Person extends DS.Model {
    @attr('string') name!: string;
    @attr('date') dob!: Date;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        person: Person;
    }
}
// END-SNIPPET
