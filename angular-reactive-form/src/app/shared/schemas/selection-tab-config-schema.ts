import { Tabs, SelectionType } from "../../widgets/select-entities-widget-module/components/select-entities-widget/select-entities-widget.component";
import { SelectionTabSchema } from "./selection-tab-schema";

export class SelectionTabConfigSchema {
    activeTab: Tabs;
    paginationSize: number;
    selectionType: SelectionType;
    tabs: SelectionTabSchema[];
    draggable: boolean;
    clearSelectionVisible: boolean;
}
