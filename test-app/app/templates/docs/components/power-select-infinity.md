# Power Select Infinity

A basic power-select-infinity component.

{{#docs-demo as |demo|}}

{{#demo.example name="power-select-infinity.hbs"}}
    <div class="col-5 px-0">
        {{power-select-infinity/demo
            onChange=this.selectItem
            selected=this.selectedItem
        }}
    </div>
{{/demo.example}}
    {{demo.snippet name="basic-power-select-snippet.ts" label="Component"}}
    {{demo.snippet name="basic-power-select-demo.hbs" label="Template"}}
{{/docs-demo}}