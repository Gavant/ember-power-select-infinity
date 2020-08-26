//@ts-ignore
import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
    name(i: number) {
        return `person ${i}`;
    },

    dob() {
        const newDate = new Date(Math.floor(Math.random() * 1000000000000));
        return newDate;
    }
});
