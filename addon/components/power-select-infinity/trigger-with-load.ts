import TriggerComponent from 'ember-power-select/components/power-select-multiple/trigger';
import { PowerSelectAPI } from 'ember-power-select/types/power-select-api';

interface PowerSelectTriggerWithLoadArgs {
    select: PowerSelectAPI<object>;
    listBoxId: number;
    placeholder: string;
    isLoading: boolean;
}

export default class PowerSelectTriggerWithLoad extends TriggerComponent<PowerSelectTriggerWithLoadArgs> {}
