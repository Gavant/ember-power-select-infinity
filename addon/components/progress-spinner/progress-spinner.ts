import Component from "@ember/component";
// @ts-ignore: Ignore import of compiled template
import layout from "@gavant/ember-power-select-infinity/templates/progress-spinner/progress-spinner";

export default class ProgressSpinnerComponent extends Component {
    layout = layout;
    classNames: string[] = ["progress-spinner"];
    classNameBindings: string[] = ["active", "light", "size"];
    active: boolean = true;
    light: boolean = false;
    size: string | null = null;
}
