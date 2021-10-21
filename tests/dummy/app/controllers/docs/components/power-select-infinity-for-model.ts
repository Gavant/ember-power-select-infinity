import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Person from '../../../models/person';

export default class PowerSelectInfinityForModelController extends Controller {
    @tracked selectedPerson: Person | null = null;
    @tracked selectedPerson2: Person | null = null;

    @action
    selectPerson(newPerson: Person | null) {
        this.selectedPerson = newPerson ?? null;
    }

    @action
    selectPerson2(newPerson: Person | null) {
        this.selectedPerson = newPerson ?? null;
    }

    // BEGIN-SNIPPET process-query-params.ts
    @action
    processQueryParams(
        term: string,
        offset: number,
        searchParamKey: string,
        additionalQueryParams: { [x: string]: any }
    ) {
        return {
            filter: {
                term: `changed_${term}`,
                [`new_${searchParamKey}`]: 'newKeywordFilter',
                isActive: false,
                ...additionalQueryParams
            },
            page: {
                limit: 10,
                offset: offset
            }
        };
    }
    // END-SNIPPET
}
