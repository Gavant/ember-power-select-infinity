//@ts-ignore
import OptionsComponent from 'ember-power-select/components/power-select/options';

interface PowerSelectInfinityOptionsOptionsArgs {
    items: any[];
    extra: {
        estimateHeight: number;
        staticHeight: boolean;
        bufferSize: number;
        lastReached(): any;
    };
    optionsClass?: string;
}

export default class PowerSelectInfinityOptionsOptions extends OptionsComponent<PowerSelectInfinityOptionsOptionsArgs> {}
