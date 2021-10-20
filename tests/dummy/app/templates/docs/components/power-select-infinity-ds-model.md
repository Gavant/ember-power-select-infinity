# Power Select Infinity For Model

A power-select-infinity used to retrieve model data.

{{#docs-demo as |demo|}}
{{#demo.example name="power-select-infinity-ds-model.hbs"}}
Open devTools and look at the API calls in the console!

 <div class="mt-3">
<h3 class="mb-3">
<u>Selected</u>
</h3>
<ul>
<li>Name: {{this.selectedItem.name}}</li>
<li>DOB: {{this.selectedItem.dob}}</li>
</ul>
</div>
<div class="col-5 px-0">
{{power-select-infinity/ds-model/demo
                onChange=this.selectPerson
                selected=this.selectedPerson
            }}
</div>
{{/demo.example}}
{{demo.snippet name="basic-power-select-for-model-demo.hbs" label="Component"}}
{{demo.snippet name="person.ts" label="Model"}}
{{/docs-demo}}

{{#docs-demo as |demo|}}
{{#demo.example name="power-select-infinity-for-model-2.hbs"}}
The query params can be manipulated using `processQueryParams` and `filters` arguments.  
 <br>
Check out the console to see what's happening!

<div class="col-5 px-0 mt-3">

</div>
{{/demo.example}}

{{/docs-demo}}