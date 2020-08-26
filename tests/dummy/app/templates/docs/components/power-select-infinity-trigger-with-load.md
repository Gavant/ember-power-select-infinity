### Trigger Loading

A Power Select with Loading State in Trigger

{{#docs-demo as |demo|}}
    {{#demo.example name="power-select-infinity-trigger-with-load.hbs"}}
        Passing in `@triggerIsSearch={{true}}` will place the loading state inside the trigger.    
        <div class="col-5 px-0 mt-3">
            {{power-select-infinity/trigger-with-load/demo
                onChange=this.selectItem
                selected=this.selectedItem
                triggerIsSearch=true
            }}
        </div>
    {{/demo.example}}
    {{demo.snippet name="power-select-infinity-trigger-with-load-demo.hbs" label="Template"}}
{{/docs-demo}}