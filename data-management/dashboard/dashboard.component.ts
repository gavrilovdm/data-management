import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DeleteFhirDataDialogComponent } from './dialogs/delete-fhir-data-dialog.component';
import { SharedService } from '../../../../shared/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../core/auth.service';
import { FHIRDashboardService, FhirDataPayload, UserTenantsTenantid } from 'api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  refreshToken$ = new BehaviorSubject<void>(undefined);

  public resourcesData$: Observable<FhirDataPayload>;

  public currentTenantData: UserTenantsTenantid;

  private sub = new Subscription();

  constructor(
    private fhirDashboardService: FHIRDashboardService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.resourcesData$ = this.refreshToken$.pipe(
      switchMap(() =>
        this.fhirDashboardService.getFhirData(
          this.authService.currentTenantId,
          this.route.snapshot.paramMap.get('deploymentId'),
        ),
      ),
      map(data => {
        return data ? data.payload[0] : undefined;
      }),
    );

    this.currentTenantData = this.authService.getCurrentTenantData();
  }

  deleteFhirData(): void {
    const dialogRef = this.dialog.open(DeleteFhirDataDialogComponent, {
      data: {
        deploymentName: this.route.snapshot.paramMap.get('deploymentId'),
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(result => result),
        tap(result => {
          if (result) {
            this.sub.add(
              this.fhirDashboardService
                .clearFhirData(this.authService.currentTenantId, this.route.snapshot.paramMap.get('deploymentId'))
                .subscribe(
                  () => {
                    this.sharedService.showSuccess('Successfully deleted FHIR data.');
                    this.refreshToken$.next();
                  },
                  () => {
                    this.sharedService.showAlert(
                      'There was an issue deleting your uploaded FHIR bundles. Please try again later.',
                    );
                  },
                ),
            );
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
