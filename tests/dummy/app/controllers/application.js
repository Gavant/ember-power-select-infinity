import Controller from '@ember/controller';
import { Promise } from 'rsvp';
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

    newUsers = [
          { name: 'James' },
          { name: 'Jimmy' },
          { name: 'Joel' },
          { name: 'Mike' },
          { name: 'Matt' },
          { name: 'Jon' }
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
    loadMore() {
        return new Promise((resolve) => {
            later(this, () => {
                resolve(this.newUsers);
            }, 600);
        });
    }
}
