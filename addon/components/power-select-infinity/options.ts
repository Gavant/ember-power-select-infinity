import OptionsComponent from 'ember-power-select/components/power-select/options';

interface PowerSelectInfinityOptionsArgs {
    items: any[];
    extra: {
        estimateHeight: number;
        staticHeight: boolean;
        bufferSize: number;
        lastReached(): any;
        isSearching: boolean;
    };
    optionsClass?: string;
}

export default class PowerSelectInfinityOptions extends OptionsComponent<PowerSelectInfinityOptionsArgs> {}
