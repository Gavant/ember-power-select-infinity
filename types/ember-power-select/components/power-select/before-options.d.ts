import Component from '@glimmer/component';

declare module 'ember-power-select/components/power-select/before-options' {
    class BeforeOptionsComponent<T> extends Component<T> {
        args: T;
    }
}
