import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorConfig, TableConfig, TableService } from '@intersystems/table';
import { TableEnhancedIdService } from 'src/app/core/table-enhanced-id.service';
import { SharedUtils } from '../../../../../shared/shared-utils';
import { Sort } from '@angular/material/sort';
import { ImportOrValidateJobObject } from 'api';

@Component({
  selector: 'app-import-logs-view',
  templateUrl: './import-logs-view.component.html',
  styleUrls: ['./import-logs-view.component.scss'],
})
export class ImportLogsViewComponent {
  @Input() importedLogs!: ImportOrValidateJobObject[];

  @Output() downloadImportLog = new EventEmitter<Record<string, unknown>>();

  loading = false;

  constructor(public tableService: TableService) {}

  tableConfig: TableConfig = {
    key: 'imported-logs-table',
    cssNoDataMessageClass: 'no-data-message',
    noDataMessage: 'No import jobs have been executed against your FHIR service',
    stickyHeaderRow: true,
    cssTRClassFromRow: TableEnhancedIdService.setTableRowIdColumn('jobid'),
    sort: {
      sortFunction: (event: Sort, data: any) => {
        return data.sort((a: any, b: any) => {
          const isAsc = event.direction === 'asc';
          switch (event.active) {
            case 'created_at':
              return this.tableService.compareAlphaNumeric(a.created_at, b.created_at, isAsc);
            case 'updated_at':
              return this.tableService.compareAlphaNumeric(a.updated_at, b.updated_at, isAsc);
            case 'status':
              return this.tableService.compareAlphaNumeric(a.status, b.status, isAsc);
            case 'duration':
              return this.tableService.compareAlphaNumeric(a.duration, b.duration, isAsc);
            case 'attempted':
              return this.tableService.compareAlphaNumeric(a.attempted, b.attempted, isAsc);
            case 'successful':
              return this.tableService.compareAlphaNumeric(a.successful, b.successful, isAsc);
            case 'failed':
              return this.tableService.compareAlphaNumeric(a.failed, b.failed, isAsc);
            default:
              return 0;
          }
        });
      },
    },
    columns: [
      {
        id: 'created_at',
        key: 'created_at',
        title: 'Created At',
        sortable: true,
        cellDisplay: {
          model: 'created_at',
        },
      },
      {
        id: 'updated_at',
        key: 'updated_at',
        title: 'Updated At',
        sortable: true,
        cellDisplay: {
          model: 'updated_at',
        },
      },
      SharedUtils.getTableColumn('jobid', 'Job ID'),
      {
        id: 'status',
        key: 'status',
        title: 'Job Status',
        sortable: true,
        cellDisplay: {
          model: 'status',
        },
      },
      {
        id: 'duration',
        key: 'duration',
        title: 'Duration',
        sortable: true,
        cellDisplay: {
          model: 'duration',
        },
      },
      {
        id: 'attempted',
        key: 'attempted',
        title: 'Total Requested Bundles',
        sortable: true,
        cellDisplay: {
          model: 'attempted',
        },
      },
      {
        id: 'successful',
        key: 'successful',
        title: 'Successful Bundles',
        sortable: true,
        cellDisplay: {
          model: 'successful',
        },
      },
      {
        id: 'failed',
        key: 'failed',
        title: 'Failed Bundles',
        sortable: true,
        cellDisplay: {
          model: 'failed',
        },
      },
      {
        key: 'download',
        id: 'download',
        title: 'Download Import Log',
        cellDisplay: {
          preset: 'actionsIcons',
          actionsIcons: {
            iconsOrder: ['download'],
            download: {
              id: 'download',
              callback: (_event, row) => this.downloadImportLog.emit(row.data),
              hidden: () => false,
              tooltip: { text: 'Download' },
              customSvgIcon: 'cloud-download',
            },
          },
        },
      },
    ],
  };

  paginatorConfig: PaginatorConfig = {
    length: this.importedLogs?.length,
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  };
}
