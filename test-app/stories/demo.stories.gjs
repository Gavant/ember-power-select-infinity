// import Component from '@glimmer/component';
import { hbs } from 'ember-cli-htmlbars';

export default {
    title: 'Power Select Infinity',
};
export const actionsData = {
    onPinTask: action('onPinTask'),
    onArchiveTask: action('onArchiveTask')
};

const Template = (args) => ({
    template: hbs`<div>wow</div>`,
    context: args
});

export const Default = Template.bind({});
Default.args = {
    task: {
        id: '1',
        title: 'Test Task',
        state: 'TASK_INBOX',
        updatedAt: new Date(2018, 0, 1, 9, 0)
    },
    ...actionsData
};

// export const Default = class Hello extends Component {
//   name = 'world';

//   <template>
//     <span>Hello, {{this.name}}!</span>
//   </template>
// }
