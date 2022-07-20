declare module 'ember-basic-dropdown/components/basic-dropdown' {
    type RepositionChanges = {
        hPosition: string;
        vPosition: string;
        otherStyles: Record<string, string | number | undefined>;
        top?: string;
        left?: string;
        right?: string;
        width?: string;
        height?: string;
    };

    export interface DropdownActions {
        toggle: (e?: Event) => void;
        close: (e?: Event, skipFocus?: boolean) => void;
        open: (e?: Event) => void;
        reposition: (...args: any[]) => undefined | RepositionChanges;
    }
    export interface Dropdown {
        uniqueId: string;
        disabled: boolean;
        isOpen: boolean;
        actions: DropdownActions;
    }
}
