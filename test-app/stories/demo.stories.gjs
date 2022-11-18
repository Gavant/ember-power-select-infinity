import Component from '@glimmer/component';
export default {
    title: 'Power Select Infinity',
};

export const Default = class Hello extends Component {
  name = 'world';

  <template>
    <span>Hello, {{this.name}}!</span>
  </template>
}
