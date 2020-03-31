import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
    allowClear: boolean = false;
    users: any[] = [
        { id: 1, name: 'Arthur' },
        { id: 2, name: 'Sam' },
        { id: 3, name: 'Dan' },
        { id: 4, name: 'Miguel' },
        { id: 5, name: 'Svilen' },
        { id: 6, name: 'Ruslan' },
        { id: 7, name: 'Kirill' },
        { id: 8, name: 'Stuart' },
        { id: 9, name: 'Jamie' },
        { id: 10, name: 'Matteo' },
        { id: 11, name: 'Bob' },
        { id: 12, name: 'Dean' },
        { id: 13, name: 'Bill' },
        { id: 14, name: 'Adam' },
        { id: 15, name: 'Scout' },
        { id: 16, name: 'Victoria' },
        { id: 17, name: 'Robert' },
        { id: 18, name: 'Brent' },
        { id: 19, name: 'Henry' },
        { id: 20, name: 'William' },
        { id: 21, name: 'Barbara' },
        { id: 22, name: 'Jessica' }
    ];

    newUsers: any[] = [
        { id: 23, name: 'James' },
        { id: 24, name: 'Jimmy' },
        { id: 25, name: 'Joel' },
        { id: 26, name: 'Mike' },
        { id: 27, name: 'Matt' },
        { id: 28, name: 'Jon' }
    ];
    @tracked canLoadMore: boolean = true;
    @tracked options: any[] = this.users;
    pageSize: number = 20;

    @action
    async loadMore(term: string | null) {
        const options = this.options;
        this.newUsers.forEach((user: object) => {
            options.push(user);
        });
        this.options = options;
        this.pageSize = options.length;
        this.canLoadMore = options.length < this.pageSize;
        return options;
    }

}
