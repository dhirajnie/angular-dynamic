import { Tabs, SelectionType, ContainerType, CategoryType, PrdType, TeamType } from "../../widgets/select-entities-widget-module/components/select-entities-widget/select-entities-widget.component";

export class SelectionTabSchema {
    tabId: Tabs;
    tabLabel?: string;
    showTab: boolean;
    selectionType?: SelectionType;
    categoryType?: CategoryType;
    teamType?: TeamType;
    containerType?: ContainerType;
    containerRootSelectable?: boolean;
    prdType?: PrdType;
    searchPlaceHolder?: string;
    itemsList?: any[];
    nextIndex?: number;
    currentPageIndex?: number;
    errorMessage?: string;
    defaultLabel?: string;
    autoSelectFirst?: boolean;
    needColumnLevel?: boolean;
    selectAllOption?: boolean;
    driverSelectionDisabled?: boolean;
}
