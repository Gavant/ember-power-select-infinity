import Controller from '@ember/controller';
import RSVP from 'rsvp';
import { later } from '@ember/runloop';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
    users = [
        { name: 'Arthur' },
        { name: 'Sam' },
        { name: 'Dan' },
        { name: 'Miguel' },
        { name: 'Svilen' },
        { name: 'Ruslan' },
        { name: 'Kirill' },
        { name: 'Stuart' },
        { name: 'Jamie' },
        { name: 'Matteo' },
        { name: 'Bob' },
        { name: 'Dean' },
        { name: 'Bill' },
        { name: 'Adam' },
        { name: 'Scout' },
        { name: 'Victoria' },
        { name: 'Robert' },
        { name: 'Brent' },
        { name: 'Henry' },
        { name: 'William' },
        { name: 'Barbara' },
        { name: 'Jessica' }
    ];

    options = this.users;

    @action
    search(term) {
        return new Promise((resolve) => {
            if (term.length === 0) {
                resolve([]);
            } else {
                later(this, () => {
                    resolve(this.users.filter((u) => u.name.indexOf(term) > -1));
                }, 600);
            }
        });
    }

    @action
    async loadMore(term) {
        const result = await generatePromise();
        await this.set('options', this.options.concat(result));
    }
}

function generatePromise() {
    return new RSVP.Promise((resolve) => {
        setTimeout(() => resolve([
            { name: 'James' },
            { name: 'Jimmy' },
            { name: 'Joel' },
            { name: 'Mike' },
            { name: 'Matt' },
            { name: 'Jon' }
        ]), 600);
    });
}
