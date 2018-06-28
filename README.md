ember-power-select-infinity
==============================================================================

![To Infinity & Beyond](https://media.giphy.com/media/U2BASTIsaw8WQ/giphy.gif)


This addon provides a power select which uses occlusion rendering to infinitely load and search for a large list of items.

Installation
------------------------------------------------------------------------------

```
ember install ember-power-select-infinity
```


Usage
------------------------------------------------------------------------------

To use `power-select-infinity` you just declare it in a template.
Both `search` and `loadMore` must return a promise to that `power-select-infinity` can display the loading indicator.
The paging is left up to you, since some API's use different formats for paging. Some API's declare page=1, others take in the last items ID.
Either way, `power-select-infinity` just provides a `loadMore` action where you can load data however your API requires.

If your using `ember-cli-sass` in your project, an import statement will automatically be added to your project.

Your Component
```
{{#power-select-infinity
    search=(action 'search')
    loadMore=(action 'loadMore')
    selected=selected
    onchange=(action (mut selected))
    as |name|}}
        {{name}}
{{/power-select-infinity
```

Your Controller

Paging using page numbers
```
export default Controller.extend({
    page: 1,
    actions: {
        search(term) {
            //API call 
            let page = get(this, 'page');
            return get(this, 'ajax').request(`names?page=${page}&search=${term}`);
        },
        loadMore(term) {
            let page = get(this, 'page');
            let newPage = get(this, 'page');
            return get(this, 'ajax').request(`names?page=${newPage}&search=${term}`).then(() => {
                set(this, 'page', newPage);
            });
        }
    }
});
```
Paging using page offset & limit
```
export default Controller.extend({
    page: 1,
    actions: {
        search(term) {
            return get(this, 'ajax').request(`names?search=${term}`);
        },
        async loadMore(term, select) {
            return get(this, 'ajax').request(`names?search=${term}&offset=${get(select, 'resultsCount')}&limit=10`);
        }
    }
});
```

If you want the power select to open when the input is focused, just pass a list of options via the options parameter.
```
{{#power-select-infinity
    options=options
    search=(action 'search')
    loadMore=(action 'loadMore')
    selected=selected
    onchange=(action (mut selected))
    as |name|}}
        {{name}}
{{/power-select-infinity
```


If your using a complex objects as the options, you need to tell `power-select-infinity` what value to display when an option is selected using
```
{{#power-select-infinity
    options=options
    search=(action 'search')
    loadMore=(action 'loadMore')
    selected=selected
    onchange=(action (mut selected))
    extra=(hash labelPath="name")
    as |user|}}
        {{user.name}}
{{/power-select-infinity
```
In the example above, Im using a user object which has a property of `name` that I want to display when selected.

There are some options you can pass to https://github.com/html-next/vertical-collection, which is what we use for the occlusion rendering. The three options are estimateHeight, bufferSize, and staticHeight. Read the vertical collection documentation for what they do and how to use them

```
{{#power-select-infinity
    options=options
    estimateHeight=75
    bufferSize=10
    staticHeight=true
    search=(action 'search')
    loadMore=(action 'loadMore')
    selected=selected
    onchange=(action (mut selected))
    as |name|}}
        {{name}}
{{/power-select-infinity
```

You can also customize the loading component by passing in your own `loadingComponent` property.

```
{{#power-select-infinity
    options=options
    search=(action 'search')
    loadMore=(action 'loadMore')
    selected=selected
    onchange=(action (mut selected))
    loadingComponent='my-loading-component'
    as |name|}}
        {{name}}
{{/power-select-infinity
```

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-power-select-infinity`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
