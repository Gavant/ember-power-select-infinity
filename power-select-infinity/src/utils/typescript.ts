export const guard = <T extends object>(
    itemToCheck: any,
    propertyNames: Array<keyof T> | keyof T
): itemToCheck is T => {
    return Array.isArray(propertyNames)
        ? Object.keys(itemToCheck as T).some((key) => propertyNames.indexOf(key as keyof T) >= 0)
        : (itemToCheck as T)[propertyNames as keyof T] !== undefined;
};

export type Modify<T, R> = Omit<T, keyof R> & R;
