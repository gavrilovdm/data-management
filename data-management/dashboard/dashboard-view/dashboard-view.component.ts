import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorConfig, TableConfig } from '@intersystems/table';
import { FhirDataPayload, UserTenantsTenantid } from 'api';
import { TableEnhancedIdService } from 'src/app/core/table-enhanced-id.service';
import { SharedUtils } from '../../../../../shared/shared-utils';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
})
export class DashboardViewComponent {
  @Input() resourcesData!: FhirDataPayload;

  @Input() currentTenantData: UserTenantsTenantid;

  @Output() deleteFhirData = new EventEmitter<void>();

  loading = false;
  tableConfig: TableConfig = {
    key: 'dashboard-table',
    cssNoDataMessageClass: 'no-data-message',
    noDataMessage: 'There are currently no extended resources',
    stickyHeaderRow: true,
    cssTRClassFromRow: TableEnhancedIdService.setTableRowIdColumn('resource'),
    columns: [
      SharedUtils.getTableColumn('resource', 'Resource'),
      SharedUtils.getTableColumn('rcount', 'Count', row => row.rcount.toLocaleString()),
    ],
  };

  paginatorConfig: PaginatorConfig = {
    length: this.resourcesData?.totalAllResources.length,
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  };
}
