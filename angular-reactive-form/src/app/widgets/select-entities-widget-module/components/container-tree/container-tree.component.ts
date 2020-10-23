import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VariableService } from "../../../../shared/services/utilities/util_variable/variable.service";
import { CatalogContainersService } from "../../../../shared/services/selection-widget/catalog-conatiners/catalog-containers.service";
import { Tabs } from "../../components/select-entities-widget/select-entities-widget.component";
import { TranslateService } from '../../../../shared/services/translate/translate.service';

@Component({
  selector: 'idm-container-tree',
  templateUrl: 'container-tree.component.html',
  styleUrls: ['container-tree.component.css']
})
export class ContainerTreeComponent implements OnInit {

  @Input("container") container;
  @Input("selectedItems") selectedItems;
  @Output("addItem") addItem: EventEmitter<any[]> = new EventEmitter();
  @Input("isRoot") isRoot;
  @Input("isRootSelectable") isRootSelectable;

  expanded: boolean = false;
  fetchedSubContainers: boolean = false;
  constructor(private vutils: VariableService, private catalogContainersService: CatalogContainersService,private translate:TranslateService) { }
  loadingSubContainers: boolean = false;
  errorMessage: string;
  error: boolean = false;

  ngOnInit() {
  }

  onAddItem(item) {
    this.addItem.emit(item);
  }

  isInSelectedContainer(item) {
    if (this.vutils.isUndefinedOrNull(this.selectedItems)) {
      return false;
    }
    for (let i = 0; i < this.selectedItems.length; ++i) {
      if (this.vutils.equals(Tabs[this.selectedItems[i].type], Tabs.container)) {
        if (this.vutils.equals(this.selectedItems[i].id, item.id)) {
          return true;
        }
      }
    }
    return false;
  }

  toggleContainer() {
    if (this.expanded) {
      this.expanded = false;
    } else {
      if (this.fetchedSubContainers) {
        this.expanded = true;
      } else {
        this.loadingSubContainers = true;
        this.expanded = true;
        this.catalogContainersService.getSubContainersList(this.container)
          .subscribe(arg => {
            this.container.subContainers = arg.subContainers;
            this.loadingSubContainers = false;
            this.fetchedSubContainers = true;
          }, error => {
            this.loadingSubContainers = false;
            this.errorMessage = this.translate.get("Failed to load sub-containers for this container.");
            this.error = true;
          });
      }
    }
  }

  isExpanded() {
    return this.expanded;
  }
}
