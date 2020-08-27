ember-power-select-infinity
==============================================================================

![To Infinity & Beyond](https://media.giphy.com/media/U2BASTIsaw8WQ/giphy.gif)


This addon provides a power select which uses occlusion rendering to infinitely load and search for a large list of items.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.16 or above
* Ember CLI v3.16 or above
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
```hbs
<PowerSelectInfinity
    @search={{this.search}}
    @searchField='name'
    @loadMore={{this.loadMore}}
    @selected={{this.selected}}
    @onChange={{fn (mut this.selected)}}
    as |name|>
        {{name}}
</PowerSelectInfinity>
```

Your Controller

Paging using page numbers
```ts
export default PagingController extends Controller {
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
```ts
export default PagingController extends Controller {
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
```hbs
<PowerSelectInfinity
    @options={{this.options}}
    @search={{this.search}}
    @searchField='name'
    @loadMore={{this.loadMore}}
    @selected={{this.selected}}
    @onChange={{fn (mut this.selected)}}
    as |name|>
        {{name}}
</PowerSelectInfinity>
```


If your using a complex objects as the options, you need to tell `power-select-infinity` what value to display when an option is selected using
```hbs
<PowerSelectInfinity
    @options={{this.options}}
    @search={{this.search}}
    @searchField='name'
    @loadMore={{this.loadMore}}
    @selected={{this.selected}}
    @onChange={{fn (mut this.selected)}}
    as |user|>
        {{user.name}}
</PowerSelectInfinity>
```
In the example above, Im using a user object which has a property of `name` that I want to display when selected.

There are some options you can pass to https://github.com/html-next/vertical-collection, which is what we use for the occlusion rendering. The three options are estimateHeight, bufferSize, and staticHeight. Read the vertical collection documentation for what they do and how to use them

```hbs
<PowerSelectInfinity
    @options={{this.options}}
    @estimateHeight={{75}}
    @bufferSize={{10}}
    @staticHeight={{true}}
    @search={{this.search}}
    @searchField='name'
    @loadMore={{this.loadMore}}
    @selected={{this.selected}}
    @onChange={{fn (mut this.selected)}}
    as |name|>
        {{name}}
</PowerSelectInfinity>
```

You can also customize the loading component by passing in your own `loadingComponent` property.

```hbs
<PowerSelectInfinity
    @options={{this.options}}
    @search={{this.search}}
    @searchField='name'
    @loadMore={{this.loadMore}}
    @selected={{this.selected}}
    @onChange={{fn (mut this.selected)}}
    @loadingComponent='my-loading-component'
    as |name|>
        {{name}}
</PowerSelectInfinity>
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
