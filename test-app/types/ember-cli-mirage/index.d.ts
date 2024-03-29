import EmberObject from '@ember/object';

import MirageModelRegistry from 'ember-cli-mirage/registries/model';
import MirageSchemaRegistry from 'ember-cli-mirage/registries/schema';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import DS from 'ember-data';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import EmberDataModelRegistry from 'ember-data/types/registries/model';

import { BelongsTo } from 'miragejs/-types';

declare global {
    // eslint-disable-next-line no-redeclare
    const server: Server; // TODO: only in tests?
}

export type ID = number | string;

interface AnyAttrs {
    [key: string]: any;
}

type DatabaseRecord<T> = T & { id: ID };

export interface DatabaseCollection<T = AnyAttrs> {
    insert<S extends T | T[]>(data: S): S extends T ? DatabaseRecord<T> : Array<DatabaseRecord<T>>;
    find<S extends ID | ID[]>(ids: S): S extends ID ? DatabaseRecord<T> : Array<DatabaseRecord<T>>;
    findBy(query: T): DatabaseRecord<T>;
    where(query: T | ((r: DatabaseRecord<T>) => boolean)): Array<DatabaseRecord<T>>;
    update(attrs: T): Array<DatabaseRecord<T>>;
    update(target: ID | T, attrs: T): Array<DatabaseRecord<T>>;
    remove(target?: ID | T): void;
    firstOrCreate(query: T, attributesForCreate?: T): DatabaseRecord<T>;
}

export interface Database {
    [collectionName: string]: DatabaseCollection;
}

export type ModelInstanceAttrs<T> = {
    [P in keyof T]: T[P] extends DS.Model & DS.PromiseObject<infer M>
        ? ModelInstance<M>
        : T[P] extends DS.Model
        ? ModelInstance<T[P]>
        : T[P] extends DS.PromiseManyArray<infer M>
        ? Collection<M>
        : T[P] extends DS.Model[] & DS.PromiseManyArray<infer M>
        ? Collection<M>
        : T[P] extends DS.Model[]
        ? Collection<T[P]>
        : T[P] extends Date
        ? Date | string
        : T[P];
};

interface ModelInstanceShared<T> {
    id: ID;
    attrs: T;
    _schema: Schema;

    save(): void;
    update<K extends keyof T>(key: K, val: T[K]): void;
    update<K extends keyof T>(attrs: { [k in keyof T]: T[K] }): void;
    destroy(): void;
    isNew(): boolean;
    isSaved(): boolean;
    reload(): void;
    toString(): string;
}

export function hasMany(model: string): void;

export type ModelInstance<T = AnyAttrs> = ModelInstanceShared<T> & ModelInstanceAttrs<T>;

export class ModelClass {
    extend(attrs: unknown): ModelClass;
}

export const Model: ModelClass;

export interface Collection<T> {
    models: Array<ModelInstance<T>>;
    length: number;
    modelName: string;
    update<K extends keyof T>(key: K, val: T[K]): void;
    update<K extends keyof T>(attrs: { [k in keyof T]: T[K] }): void;
    save(): void;
    reload(): void;
    destroy(): void;
    sort(sortFn: (a: ModelInstance<T>, b: ModelInstance<T>) => number): Collection<T>;
    filter(filterFn: (model: ModelInstance<T>) => boolean): Collection<T>;
}

interface SchemaModelCollection<T = AnyAttrs> {
    new (attrs: Partial<ModelAttrs<T>>): ModelInstance<T>;
    create(attrs: Partial<ModelAttrs<T>>): ModelInstance<T>;
    update(attrs: Partial<ModelAttrs<T>>): ModelInstance<T>;
    all(): Collection<T>;
    find<S extends ID | ID[]>(ids: S): S extends ID ? ModelInstance<T> : Collection<T>;
    findBy(query: Partial<ModelAttrs<T>>): ModelInstance<T>;
    first(): ModelInstance<T>;
    where(query: Partial<ModelAttrs<T>> | ((r: ModelInstance<T>) => boolean)): Collection<T>;
}

export type Schema = {
    [modelName in keyof MirageSchemaRegistry]: SchemaModelCollection<MirageSchemaRegistry[modelName]>;
} & {
    [modelName: string]: SchemaModelCollection;
} & {
    db: Database;
};

export declare class Response {
    constructor(code: number, headers?: Record<string, string>, body?: Record<string, unknown>);
}

export interface Request {
    requestBody: any;
    url: string;
    params: {
        [key: string]: string | number;
    };
    queryParams: {
        [key: string]: string;
    };
    method: string;
}

export type NormalizedRequestAttrs<T> = {
    [P in keyof T]: T[P] extends DS.Model & DS.PromiseObject<DS.Model>
        ? never
        : T[P] extends DS.Model
        ? never
        : T[P] extends DS.PromiseManyArray<DS.Model>
        ? never
        : T[P] extends DS.Model[] & DS.PromiseManyArray<DS.Model>
        ? never
        : T[P] extends DS.Model[]
        ? never
        : T[P];
};

export interface HandlerContext {
    request: Request;
    serialize(modelOrCollection: ModelInstance | ModelInstance[] | SchemaModelCollection, serializerName?: string): any;
    normalizedRequestAttrs<M extends keyof ModelRegistry>(model: M): NormalizedRequestAttrs<ModelRegistry[M]>;
}
interface HandlerObject {
    [k: string]: any;
}
interface HandlerOptions {
    timing?: number;
    coalesce?: boolean;
}
export type HandlerFunction = (this: HandlerContext, schema: Schema, request: Request) => any;

/* tslint:disable unified-signatures */
export function handlerDefinition(path: string, options?: HandlerOptions): void;
export function handlerDefinition(path: string, shorthand: string | string[], options?: HandlerOptions): void;
export function handlerDefinition(
    path: string,
    shorthand: string | string[],
    responseCode: number,
    options?: HandlerOptions
): void;
export function handlerDefinition(path: string, responseCode?: number, options?: HandlerOptions): void;
export function handlerDefinition(
    path: string,
    handler: HandlerFunction | HandlerObject,
    options?: HandlerOptions
): void;
export function handlerDefinition(
    path: string,
    handler: HandlerFunction | HandlerObject,
    responseCode: number,
    options?: HandlerOptions
): void;
/* tslint:enable unified-signatures */

export type resourceAction = 'index' | 'show' | 'create' | 'update' | 'delete';

export type ModelAttrs<T> = {
    [P in keyof T]: P extends 'id'
        ? string | number
        : T[P] extends DS.Model & DS.PromiseObject<infer M>
        ? ModelInstance<M>
        : T[P] extends DS.Model
        ? ModelInstance<T[P]>
        : T[P] extends DS.PromiseManyArray<infer M>
        ? Array<ModelInstance<M>>
        : T[P] extends DS.Model[] & DS.PromiseManyArray<infer M>
        ? Array<ModelInstance<M>>
        : T[P] extends DS.Model[]
        ? Array<ModelInstance<T[P]>>
        : T[P] extends Date
        ? Date | string
        : T[P];
};

export type ModelRegistry = EmberDataModelRegistry & MirageModelRegistry;

export interface Server {
    schema: Schema;
    db: Database;

    namespace: string;
    timing: number;
    logging: boolean;
    pretender: any;
    urlPrefix: string;

    get: typeof handlerDefinition;
    post: typeof handlerDefinition;
    put: typeof handlerDefinition;
    patch: typeof handlerDefinition;
    del: typeof handlerDefinition;

    resource(
        resourceName: string,
        options?: { only?: resourceAction[]; except?: resourceAction[]; path?: string }
    ): void;

    loadFixtures(...fixtures: string[]): void;

    // TODO when https://github.com/Microsoft/TypeScript/issues/1360
    // passthrough(...paths: string[], verbs?: Verb[]): void;
    passthrough(...args: any[]): void;

    create<T extends keyof ModelRegistry>(modelName: T, ...traits: string[]): ModelInstance<ModelRegistry[T]>;
    create<T extends keyof ModelRegistry>(
        modelName: T,
        attrs?: Partial<ModelAttrs<ModelRegistry[T]>>,
        ...traits: string[]
    ): ModelInstance<ModelRegistry[T]>;

    createList<T extends keyof ModelRegistry>(
        modelName: T,
        amount: number,
        ...traits: string[]
    ): Array<ModelInstance<ModelRegistry[T]>>;
    createList<T extends keyof ModelRegistry>(
        modelName: T,
        amount: number,
        attrs?: Partial<ModelAttrs<ModelRegistry[T]>>,
        ...traits: string[]
    ): Array<ModelInstance<ModelRegistry[T]>>;

    shutdown(): void;
}

export type TraitOptions<M> = AnyAttrs & {
    afterCreate?: (obj: ModelInstance<M>, svr: Server) => void;
};

export interface Trait<O extends TraitOptions<any> = Record<string, unknown>> {
    extension: O;
    __isTrait__: true;
}

export function trait<M extends ModelRegistry[keyof ModelRegistry], O extends TraitOptions<M> = TraitOptions<M>>(
    options: O
): Trait<O>;

// TODO when https://github.com/Microsoft/TypeScript/issues/1360
// function association(...traits: string[], overrides?: { [key: string]: any }): any;

export function association(...args: any[]): any;
export { belongsTo } from 'miragejs';

export type FactoryAttrs<T> = {
    [P in keyof T]?: T[P] | BelongsTo<any> | ((index: number) => T[P]);
} & {
    afterCreate?(newObj: ModelInstance<T>, server: Server): void;
};

export class FactoryClass {
    extend<T>(attrs: FactoryAttrs<T>): FactoryClass;
}

export const Factory: FactoryClass;

export class JSONAPISerializer extends EmberObject {
    declare request: Request;

    keyForAttribute(attr: string): string;
    keyForCollection(modelName: string): string;
    keyForModel(modelName: string): string;
    keyForRelationship(relationship: string): string;
    typeKeyForModel(model: ModelInstance): string;

    serialize(object: ModelInstance, request: Request): any;
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    normalize(json: any): any;
}
