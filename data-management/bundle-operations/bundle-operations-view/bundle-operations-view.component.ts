import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PaginatorConfig, TableConfig } from '@intersystems/table';
import { SharedUtils } from '../../../../../shared/shared-utils';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileData } from '../bundle-operations.component';
import { TableEnhancedIdService } from 'src/app/core/table-enhanced-id.service';
import { ImportBundles, UserTenantsTenantid } from 'api';

const mimeAllowed = ['application/json'];

@Component({
  selector: 'app-bundle-operations-view',
  templateUrl: './bundle-operations-view.component.html',
  styleUrls: ['./bundle-operations-view.component.scss'],
})
export class BundleOperationsViewComponent implements OnInit {
  @Input() importedBundlesData: ImportBundles;
  @Input() importInProgress: boolean;

  @Input() shouldBeImportedBundlesCount: number;

  @Input() remainingValidateBundlesCount: number;

  @Input() dataAfterValidate: any;
  @Input() currentTenantData: UserTenantsTenantid;

  @Output() showInfo = new EventEmitter<string>();
  @Output() showAlert = new EventEmitter<string>();
  @Output() onValidateBundles = new EventEmitter<string>();
  @Output() clearBundles = new EventEmitter<string>();
  @Output() validateBundles = new EventEmitter<string>();
  @Output() stopValidateBundles = new EventEmitter<string>();
  @Output() importBundles = new EventEmitter<string>();
  @Output() stopImportBundles = new EventEmitter<string>();
  @Output() uploadBundle = new EventEmitter<FileData[]>();
  @Output() uploadScenario = new EventEmitter<string>();

  @ViewChild('_bundleFile', { static: false })
  fileInput: ElementRef;

  public filesForUpload: Array<FileData> = [];

  uploadForm: FormGroup;

  public data: any = [
    {
      id: '6',
      name: 'Reload Initial Quickstart',
      num_bundles: 28,
      resources_created: 7505,
      size_on_disk: '20.4 MB',
      patients_created: 26,
      organizations_created: 140,
      practitioners_created: 140,
      description: 'Reload the population of ~25 Synthea-generated patients that came with the deployment initially.',
    },
    {
      id: '11',
      name: 'Synthea Population ~100',
      num_bundles: 114,
      resources_created: 79259,
      size_on_disk: '237.1 MB',
      patients_created: 112,
      organizations_created: 193,
      practitioners_created: 193,
      description: 'Synthea-generated population of ~100 patients in the state of Massachusetts.',
    },
    {
      id: '12',
      name: 'Synthea Population ~50',
      num_bundles: 61,
      resources_created: 43458,
      size_on_disk: '157.5 MB',
      patients_created: 59,
      organizations_created: 114,
      practitioners_created: 144,
      description: 'Synthea-generated population of ~50 patients in the state of Massachusetts.',
    },
    {
      id: '14',
      name: 'Synthea Population ~250',
      num_bundles: 288,
      resources_created: 195612,
      size_on_disk: '715.8 MB',
      patients_created: 286,
      organizations_created: 384,
      practitioners_created: 384,
      description: 'Synthea-generated population of ~250 patients in the state of Massachusetts.',
    },
    {
      id: '15',
      name: 'Synthea Population ~500',
      num_bundles: 567,
      resources_created: 390346,
      size_on_disk: '1.2 GB',
      patients_created: 565,
      organizations_created: 647,
      practitioners_created: 648,
      description: 'Synthea-generated population of ~500 patients in the state of Massachusetts.',
    },
    {
      id: '16',
      name: 'Social Determinants of Health',
      num_bundles: 53,
      resources_created: 3177,
      size_on_disk: '10.2 MB',
      patients_created: 51,
      organizations_created: 58,
      practitioners_created: 58,
      description:
        'Synthea-generated population of ~50 SDOH (potentially homeless) patients in the state of Massachusetts.',
    },
    {
      id: '17',
      name: 'Covid-19',
      num_bundles: 55,
      resources_created: 9646,
      size_on_disk: '21.9 MB',
      patients_created: 53,
      organizations_created: 85,
      practitioners_created: 85,
      description: 'Synthea-generated population of ~50 COVID-19 patients in the state of Massachusetts.',
    },
    {
      id: '18',
      name: 'Allergies',
      num_bundles: 57,
      resources_created: 3423,
      size_on_disk: '10.3 MB',
      patients_created: 51,
      organizations_created: 156,
      practitioners_created: 156,
      description: 'Synthea-generated population of ~50 allergy patients in the state of Massachusetts.',
    },
    {
      id: '19',
      name: 'Rheumatoid Arthritis',
      num_bundles: 53,
      resources_created: 3142,
      size_on_disk: '10.2 MB',
      patients_created: 51,
      organizations_created: 54,
      practitioners_created: 52,
      description: 'Synthea-generated population of ~50 rheumatoid arthritis patients in the state of Massachusetts.',
    },
    {
      id: '20',
      name: 'Veterans',
      num_bundles: 102,
      resources_created: 5690,
      size_on_disk: '18.2 MB',
      patients_created: 100,
      organizations_created: 107,
      practitioners_created: 107,
      description: 'Synthea-generated population of ~100 veteran patients in the state of Massachusetts.',
    },
  ];

  loading = false;

  bundlesTableConfig: TableConfig = {
    key: 'bundles-table',
    cssNoDataMessageClass: 'no-data-message',
    noDataMessage: 'No data available',
    stickyHeaderRow: true,
    cssTRClassFromRow: TableEnhancedIdService.setTableRowIdColumn('name'),
    columns: [
      SharedUtils.getTableColumn('name', 'Scenario'),
      SharedUtils.getTableColumn('num_bundles', 'Bundles'),
      SharedUtils.getTableColumn('resources_created', 'Resources'),
      SharedUtils.getTableColumn('patients_created', 'Patients'),
      SharedUtils.getTableColumn('organizations_created', 'Organizations'),
      SharedUtils.getTableColumn('practitioners_created', 'Practitioners'),
      SharedUtils.getTableColumn('size_on_disk', 'Size on Disk'),
      {
        key: 'actions',
        id: 'actions',
        title: 'Actions',
        cellDisplay: {
          preset: 'actionsIcons',

          actionsIcons: {
            iconsOrder: ['view', 'upload'],
            view: {
              id: 'view',
              tooltip: { text: 'View Details' },
              callback: (_event, row) => this.showInfo.emit(row.description),
              hidden: () => false,
            },
            upload: {
              id: 'upload',
              tooltip: { text: 'Upload Scenario' },
              customSvgIcon: 'cloud-upload',
              callback: (_event, row) => {
                this.uploadScenario.emit(row.id);
              },
              hidden: () => false,
            },
          },
        },
      },
    ],
  };

  validBundlesTableConfig: TableConfig = {
    key: 'after-validate-table',
    cssNoDataMessageClass: 'no-data-message',
    noDataMessage: 'There are no valid bundles to show',
    stickyHeaderRow: true,
    cssTRClassFromRow: TableEnhancedIdService.setTableRowIdColumn('bundle'),
    columns: [SharedUtils.getTableColumn('bundle', 'Bundle')],
  };

  invalidBundlesTableConfig: TableConfig = {
    key: 'after-validate-table',
    cssNoDataMessageClass: 'no-data-message',
    noDataMessage: 'There are no invalid bundles to show',
    stickyHeaderRow: true,
    cssTRClassFromRow: TableEnhancedIdService.setTableRowIdColumn('bundle'),
    columns: [SharedUtils.getTableColumn('bundle', 'Bundle'), SharedUtils.getTableColumn('response', 'Error')],
  };

  paginatorConfig: PaginatorConfig = {
    length: this.data.length,
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      bundleFile: [''],
    });
  }

  public addFiles(event) {
    if (!event.target.files || !event.target.files[0]) return;
    Array.from(event.target.files).forEach((file: any) => {
      if (!mimeAllowed.includes(file.type)) {
        this.showAlert.emit(`Type of file ${file.name} is not allowed`);
        this.removeFile();
        return;
      }

      const reader = new FileReader();

      reader.onload = e => {
        this.filesForUpload.push({ name: file.name, type: file.type, size: file.size, content: e.target.result });
      };

      reader.readAsText(file);
    });
  }

  public removeFile() {
    this.fileInput.nativeElement.value = '';
    this.filesForUpload = [];
  }

  public upload() {
    if (!this.validateInProgress() && !this.importInProgress) {
      if (this.filesForUpload) {
        this.uploadBundle.emit(this.filesForUpload);
        this.filesForUpload = [];
      }
    } else {
      this.showAlert.emit('Please wait for other process on this page to end.');
    }
  }

  public validateInProgress(): boolean {
    return this.dataAfterValidate === 'IN PROCESS';
  }
}
