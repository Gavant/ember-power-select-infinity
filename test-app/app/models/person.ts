// BEGIN-SNIPPET person.ts

import Model, { attr } from '@ember-data/model';

export default class Person extends Model {
    @attr('string') name!: string;
    @attr('date') dob!: Date;
}
// END-SNIPPET

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        person: Person;
    }
}
