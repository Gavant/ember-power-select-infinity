// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Ignore import
import PowerSelectOptions from 'ember-power-select/components/power-select/options';

export default class PowerSelectInfinityOptions extends PowerSelectOptions {
    get estimateHeight() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Ignore import
        return this.args.extra.estimateHeight ?? 30;
    }

    get renderAll() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Ignore import
        return this.args.extra.renderAll ?? true;
    }
}
