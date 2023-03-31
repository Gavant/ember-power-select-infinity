import PowerSelectOptions from 'ember-power-select/components/power-select/options';

export default class PowerSelectInfinityOptions<T> extends PowerSelectOptions<T> {
    get estimateHeight() {
        return this.args.extra.estimateHeight ?? 30;
    }

    get renderAll() {
        return this.args.extra.renderAll ?? true;
    }
}
