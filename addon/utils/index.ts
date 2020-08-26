import { isEmpty } from '@ember/utils';

/**
 * Remove empty(using [isEmpty](https://api.emberjs.com/ember/release/functions/@ember%2Futils/isEmpty))
 * query params from the query params object thats built from `buildQueryParams`
 *
 * @export
 * @param {any} queryParams The query params object
 * @return {QueryParamsObj} object with empty query params removed
 */
export function removeEmptyQueryParams(queryParams: { [x: string]: any }): { [x: string]: any } {
    for (let i in queryParams) {
        if (isEmpty(queryParams[i])) {
            delete queryParams[i];
        }
    }

    return queryParams;
}
