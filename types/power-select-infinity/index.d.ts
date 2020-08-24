import {
    PowerSelectArgs,
    Select,
    SelectActions
} from "ember-power-select/components/power-select";

declare module "@gavant/ember-power-select-infinity" {
    interface PowerSelectArgs {
        afterOptionsComponent?: string;
        allowClear?: boolean;
        animationEnabled?: boolean;
        ariaDescribedBy?: string;
        ariaInvalid?: string;
        ariaLabel?: string;
        ariaLabelledBy?: string;
        beforeOptionsComponent?: string;
        buildSelection?: (
            lastSelection: unknown,
            select: Select
        ) => unknown | null;
        calculatePosition?: (
            trigger: HTMLElement,
            content: HTMLElement,
            destination: HTMLElement,
            options: CalculatePositionOptions
        ) => {
            horizontalPosition: HorizontalPositions;
            verticalPosition: VerticalPositions;
            style: PositionStyle;
        };
        class?: string;
        closeOnSelect?: boolean;
        defaultHighlighted?: unknown;
        destination?: string;
        disabled?: boolean;
        dropdownClass?: string;
        extra?: { [index: string]: any };
        groupComponent?: string;
        highlightOnHover?: boolean;
        horizontalPosition?: HorizontalPositions;
        intiallyOpened?: boolean;
        loadingMessage?: string;
        eventType?: string;
        matcher?: (option: unknown, searchTerm: string) => boolean;
        matchTriggerWidth?: boolean;
        noMatchesMessage?: string;
        onBlur?: (select: Select, event: FocusEvent) => void;
        onChange?: (
            selection: unknown,
            select: Selection,
            event?: Event
        ) => void;
        onClose?: (select: Select, e: Event) => boolean | undefined;
        onFocus?: (select: Select, event: FocusEvent) => void;
        onInput?: (
            term: string,
            select: Select,
            e: Event
        ) => string | false | void;
        onKeydown?: (select: Select, e: KeyboardEvent) => boolean | undefined;
        onOpen?: (select: Select, e: Event) => boolean | undefined;
        options: unknown[];
        optionsComponent?: string;
        placeholder?: string;
        placeholderComponent?: string;
        preventScroll?: boolean;
        registerAPI?: (select: Select) => void;
        renderInPlace?: boolean;
        scrollTo?: (option: unknown, select: Select) => void;
        search?: (term: string, select: Select) => any[] | Promise<unknown[]>;
        searchEnabled?: boolean;
        searchField?: string;
        searchMessage?: string;
        searchPlaceholder?: string;
        selected?: unknown | unknown[];
        selectedItemComponent?: string;
        tabindex?: string;
        triggerClass?: string;
        triggerComponent?: string;
        triggerId?: string;
        triggerRole?: string;
        typeAheadMatcher?: (option: unknown, searchTerm: string) => boolean;
        verticalPosition?: VerticalPositions;
    }

    interface CalculatePositionOptions {
        previousHorizontalPosition: HorizontalPositions;
        horizontalPosition: HorizontalPositions;
        previousVerticalPosition: VerticalPositions;
        verticalPosition: VerticalPositions;
        matchTriggerWidth: boolean;
        renderInPlace: boolean;
    }

    interface PositionStyle {
        top?: number;
        left?: number;
        right?: number;
        width?: number;
    }

    enum HorizontalPositions {
        LEFT = "left",
        RIGHT = "right",
        CENTER = "center",
        AUTO = "auto"
    }

    enum VerticalPositions {
        ABOVE = "above",
        BELOW = "below",
        AUTO = "auto"
    }
}
