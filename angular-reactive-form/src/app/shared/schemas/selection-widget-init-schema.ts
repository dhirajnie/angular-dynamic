import { SelectionType, Tabs, ContainerType, CategoryType, PrdType, TeamType } from "../../widgets/select-entities-widget-module/components/select-entities-widget/select-entities-widget.component";
import { SelectionTabInitSchema } from "./selection-tab-init-schema";

export class SelectionWidgetInitSchema {
    widgetId: string;
    activeTab: Tabs;
    selectionType: SelectionType;
    draggable: boolean;
    clearSelectionVisible?: boolean;
    user?: {
        selectionType: SelectionType
    };
    group?: {
        selectionType: SelectionType
    };
    role?: {
        selectionType: SelectionType,
        needColumnLevel?: boolean
    };
    resource?: {
        selectionType: SelectionType
    };
    category?: {
        selectionType: SelectionType,
        categoryType: CategoryType
    };
    team?: {
        selectionType: SelectionType,
        teamType: TeamType
    };
    container?: {
        selectionType: SelectionType,
        containerType: ContainerType,
        containerRootSelectable: boolean
    };
    prd?: {
        selectionType: SelectionType,
        prdType: PrdType
    };
    driverOrEntitlement?: {
        selectionType: SelectionType,
        selectAllOption?: boolean,
        autoSelectFirst?: boolean,
        driverSelectionDisabled?: boolean
    };
    dropdown?: {
        defaultLabel: string,
        autoSelectFirst: boolean;
        tabLabel?:string;
    };
    entitlementValues?: {

    };
    sod?: {
        selectionType: SelectionType,
    };
    dirxmldriver?: {
        selectionType: SelectionType,
    };
    entity?: {
        selectionType: SelectionType,
        lookupEntity: string,
        lookupAttributes: any,
        clientId?: string,
        displayAttributes?: any,
        isOrgchart?: boolean
    };
    sodRecipient?: {
        selectionType: SelectionType,
        sodRecipientData : any[]
    }
}
