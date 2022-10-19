import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { DataManagementRoutingModule } from './data-management-routing.module';
import { DataManagementComponent } from './data-management.component';
import { BundleOperationsComponent } from './bundle-operations/bundle-operations.component';
import { BundleOperationsViewComponent } from './bundle-operations/bundle-operations-view/bundle-operations-view.component';
import { ConnectionsPageComponent } from './connections/connections-page.component';
import { ConnectionsViewComponent } from './connections/connections-view/connections-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardViewComponent } from './dashboard/dashboard-view/dashboard-view.component';
import { DeleteFhirDataDialogComponent } from './dashboard/dialogs/delete-fhir-data-dialog.component';
import { ImportLogsComponent } from './import-logs/import-logs.component';
import { ImportLogsViewComponent } from './import-logs/import-logs-view/import-logs-view.component';

@NgModule({
  declarations: [
    DataManagementComponent,
    BundleOperationsComponent,
    BundleOperationsViewComponent,
    ConnectionsPageComponent,
    ConnectionsViewComponent,
    DashboardComponent,
    DashboardViewComponent,
    DeleteFhirDataDialogComponent,
    ImportLogsComponent,
    ImportLogsViewComponent,
  ],
  imports: [CommonModule, SharedModule, DataManagementRoutingModule],
})
export class DataManagementModule {}
