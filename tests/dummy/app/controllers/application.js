import Controller from '@ember/controller';
import RSVP from 'rsvp';
import { later } from '@ember/runloop';

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
    { name: 'James' }
];

export default Controller.extend({
    actions: {
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
        },
        loadMore(term) {
            return new RSVP.Promise(function(resolve) {
                if (term.length === 0) {
                    resolve([]);
                } else {
                    later(function() {
                        resolve(newUsers.filter((u) => u.name.indexOf(term) > -1));
                    }, 600);
                }
            });
        }
    }
});
