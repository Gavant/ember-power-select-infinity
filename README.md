ember-power-select-infinity
==============================================================================

![To Infinity & Beyond](https://media.giphy.com/media/U2BASTIsaw8WQ/giphy.gif)


This addon provides a power select which uses occlusion rendering to infinitely load and search for a large list of items.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.12 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


Installation
------------------------------------------------------------------------------

```
ember install @gavant/ember-power-select-infinity
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
<PowerSelectInfinity
    @search={{action this.search}}
    @loadMore={{action this.loadMore}}
    @selected={{this.selected}}
    @onchange={{action (mut this.selected)}}
    as |name|>
        {{name}}
</PowerSelectInfinity>
```

Your Controller

Paging using page numbers
```
export default class PagingController extends Controller {
    page = 1;

    @action
    search(term) {
        //API call
        let page = get(this, 'page');
        return get(this, 'ajax').request(`names?page=${page}&search=${term}`);
    }

    @action
    loadMore(term) {
        let page = get(this, 'page');
        let newPage = get(this, 'page');
        return get(this, 'ajax').request(`names?page=${newPage}&search=${term}`).then(() => {
            this.page = newPage;
        });
    }
}
```
Paging using page offset & limit
```
export default class PagingOffsetController extends Controller {
    page = 1;

    @action
    search(term) {
        return get(this, 'ajax').request(`names?search=${term}`);
    }

    @action
    async loadMore(term, select) {
        return get(this, 'ajax').request(`names?search=${term}&offset=${get(select, 'resultsCount')}&limit=10`);
    }
}
```

If you want the power select to open when the input is focused, just pass a list of options via the options parameter.
```
<PowerSelectInfinity
    @options={{this.options}}
    @search={{action this.search}}
    @loadMore={{action this.loadMore}}
    @selected={{this.selected}}
    @onchange={{action (mut this.selected)}}
    as |name|>
        {{name}}
</PowerSelectInfinity>
```


If your using a complex objects as the options, you need to tell `power-select-infinity` what value to display when an option is selected using
```
<PowerSelectInfinity
    @options={{this.options}}
    @search={{action this.search}}
    @loadMore={{action this.loadMore}}
    @selected={{this.selected}}
    @onchange={{action (mut this.selected)}}
    @extra={{hash labelPath="name"}}
    as |user|>
        {{user.name}}
</PowerSelectInfinity>
```
In the example above, Im using a user object which has a property of `name` that I want to display when selected.

There are some options you can pass to https://github.com/html-next/vertical-collection, which is what we use for the occlusion rendering. The three options are estimateHeight, bufferSize, and staticHeight. Read the vertical collection documentation for what they do and how to use them

```
<PowerSelectInfinity
    @options={{this.options}}
    @estimateHeight={{75}}
    @bufferSize={{10}}
    @staticHeight={{true}}
    @search={{action this.search}}
    @loadMore={{action this.loadMore}}
    @selected={{this.selected}}
    @onchange={{action (mut this.selected)}}
    as |name|>
        {{name}}
</PowerSelectInfinity>
```

You can also customize the loading component by passing in your own `loadingComponent` property.

```
<PowerSelectInfinity
    @options={{this.options}}
    @search={{action this.search}}
    @loadMore={{action this.loadMore}}
    @selected={{this.selected}}
    @onchange={{action (mut this.selected)}}
    loadingComponent='my-loading-component'
    as |name|>
        {{name}}
</PowerSelectInfinity>
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


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
