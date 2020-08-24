import { getOwner } from '@ember/application';
import Ember from 'ember';

export function argDefault(_target: any, propertyKey: string, descriptor?: any): any {
    return {
        get(this: any): any {
            return this.args[propertyKey] ?? descriptor.initializer();
        }
    };
}

export function dontRunInFastboot(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const fn = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const isFastboot = getOwner(this).lookup(`service:fastboot`)?.isFastBoot;
        if (!isFastboot) {
            fn.call(this, ...args);
        }
    };
}

export function dontRunInTests(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const fn = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const isTesting = Ember.testing;
        if (!isTesting) {
            fn.call(this, ...args);
        }
    };
}
