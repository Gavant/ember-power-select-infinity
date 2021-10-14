/**
 * Generic type guard
 *
 * @template T
 * @param {*} itemToCheck
 * @param {(Array<keyof T> | keyof T)} propertyNames
 * @returns {itemToCheck is T}
 */
export const guard = <T>(itemToCheck: any, propertyNames: Array<keyof T> | keyof T): itemToCheck is T => {
    return Array.isArray(propertyNames)
        ? Object.keys(itemToCheck as T).some((key) => propertyNames.indexOf(key as keyof T) >= 0)
        : (itemToCheck as T)[propertyNames as keyof T] !== undefined;
};

/**
 * Modifies the type of an object to override certain properties.
 * Generally used with Ember Changesets to signify that properties
 * can be of different types when being updated.
 *
 * ex:
 * ```
 * interface User { accountBalance: number };
 *
 * type UserChangeset = GenericChangeset<Modify<User, { accountBalance?: string | number}>>;
 * ```
 */
export type Modify<T, R> = Omit<T, keyof R> & R;
