import Controller from '@ember/controller';
import RSVP from 'rsvp';
import { later } from '@ember/runloop';
import { action } from '@ember/object';

const users = [
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

const newUsers = [
    { name: 'James' },
    { name: 'Jimmy' },
    { name: 'Joel' },
    { name: 'Mike' },
    { name: 'Matt' },
    { name: 'Jon' }
];

export default class ApplicationController extends Controller {
    options = users;

    @action
    search(term) {
        return new RSVP.Promise(function(resolve) {
            if (term.length === 0) {
                resolve([]);
            } else {
                later(function() {
                    resolve(users.filter((u) => u.name.indexOf(term) > -1));
                }, 600);
            }
        });
    }

    @action
    loadMore(term) {
        return new RSVP.Promise(function(resolve) {
            later(function() {
                resolve(newUsers);
            }, 600);
        });
    }
}
