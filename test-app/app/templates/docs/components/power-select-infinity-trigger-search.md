### Trigger Loading

A Power Select with Loading State in the trigger

{{#docs-demo as |demo|}}
    {{#demo.example name="power-select-infinity-trigger-search.hbs"}}
        Passing in `@triggerIsSearch={{true}}` will place the loading state inside the trigger.    
        <div class="col-5 px-0 mt-3">
            {{power-select-infinity/trigger-search/demo
                onChange=this.selectItem
                selected=this.selectedItem
                triggerIsSearch=true
            }}
        </div>
    {{/demo.example}}
    {{demo.snippet name="power-select-infinity-trigger-search-demo.hbs" label="Template"}}
{{/docs-demo}}