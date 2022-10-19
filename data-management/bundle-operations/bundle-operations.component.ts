import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { BehaviorSubject, from, Observable, of, Subscription, timer } from 'rxjs';
import { concatMap, delay, delayWhen, map, retryWhen, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '@intersystems/spinner';
import { AuthService } from '../../../../core/auth.service';
import { BundleOperationsService, ImportBundles, Job, UserTenantsTenantid } from 'api';
import { HttpClient } from '@angular/common/http';

export type FileData = { name: string; type: string; size: string; content: string | ArrayBuffer };

@Component({
  selector: 'app-bundle-operations',
  templateUrl: './bundle-operations.component.html',
  styleUrls: ['./bundle-operations.component.scss'],
})
export class BundleOperationsComponent implements OnInit, OnDestroy {
  refreshToken$ = new BehaviorSubject<void>(undefined);

  public importedBundlesData$: Observable<ImportBundles>;

  public importInProgress$: Observable<boolean>;

  public validateInProgress$: Observable<boolean>;

  private validateBundles$: Observable<Job>;

  private validationCancelled = false;

  public dataAfterValidate: any;

  public currentBundlesCount: number;
  public shouldBeImportedBundlesCount: number;
  public remainingValidateBundlesCount: number;

  public currentTenantData: UserTenantsTenantid;

  private sub = new Subscription();

  constructor(
    private bundleOperationsService: BundleOperationsService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private spinnerService: SpinnerService,
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.importedBundlesData$ = this.refreshToken$.pipe(
      switchMap(() =>
        this.bundleOperationsService.getImportBundles(
          this.authService.currentTenantId,
          this.route.snapshot.paramMap.get('deploymentId'),
        ),
      ),
      map((data: ImportBundles) => {
        this.currentBundlesCount = data.fhir;
        return data ? data : undefined;
      }),
    );

    this.importInProgress$ = this.importedBundlesData$.pipe(
      switchMap(data => {
        return data.fhir != 0
          ? this.bundleOperationsService.getJobsLogs(
              this.authService.currentTenantId,
              this.route.snapshot.paramMap.get('deploymentId'),
              'ImportJob',
            )
          : of([]);
      }),
      map(data => data.some(job => job.status == 'IN PROGRESS')),
      tap(isInProgress => {
        if (isInProgress) setTimeout(() => this.refreshToken$.next(), 5000);
      }),
    );

    this.validateInProgress$ = this.importedBundlesData$.pipe(
      switchMap(data =>
        data.fhir != 0
          ? this.bundleOperationsService.getJobsLogs(
              this.authService.currentTenantId,
              this.route.snapshot.paramMap.get('deploymentId'),
              'ValidateJob',
            )
          : of([]),
      ),
      map(data => data.some(job => job.status == 'IN PROGRESS')),
      tap(isInProgress => {
        if (isInProgress) setTimeout(() => this.refreshToken$.next(), 5000);
      }),
    );

    this.validateBundles$ = this.bundleOperationsService
      .validateBundles(this.authService.currentTenantId, this.route.snapshot.paramMap.get('deploymentId'), {})
      .pipe(
        switchMap(data => {
          return this.bundleOperationsService
            .getJobs(
              this.authService.currentTenantId,
              this.route.snapshot.paramMap.get('deploymentId'),
              data.validateJobId,
            )
            .pipe(
              map(job => {
                if (job.status == 'IN PROGRESS') {
                  this.remainingValidateBundlesCount = this.currentBundlesCount - job.data.length;
                  throw job.status;
                }
                if (this.validationCancelled) {
                  this.validationCancelled = false;
                  this.remainingValidateBundlesCount = 0;
                  this.sharedService.showSuccess('Successfully cancelled validation task');
                  return;
                }
                return job;
              }),
              retryWhen(errors => errors.pipe(delayWhen(() => timer(1000)))),
            );
        }),
      );

    this.sub.add(this.importedBundlesData$.subscribe());

    this.currentTenantData = this.authService.getCurrentTenantData();
  }

  public onValidateBundles() {
    this.validateBundles();
  }

  stopValidateBundles() {
    this.bundleOperationsService
      .stopValidateBundles(this.authService.currentTenantId, this.route.snapshot.paramMap.get('deploymentId'), {})
      .subscribe(() => {
        this.validationCancelled = true;
        this.dataAfterValidate = undefined;
        this.refreshToken$.next();
      });
  }

  public onUploadScenario(scenarioId: string) {
    this.uploadScenario(scenarioId);
  }

  stopImportBundles() {
    this.bundleOperationsService
      .stopImportBundles(this.authService.currentTenantId, this.route.snapshot.paramMap.get('deploymentId'), {})
      .subscribe(() => {
        this.sharedService.showSuccess('Successfully cancelled import task.');
        this.refreshToken$.next();
        this.shouldBeImportedBundlesCount = 0;
        this.dataAfterValidate = undefined;
      });
  }

  clearBundles(): void {
    this.sub.add(
      this.bundleOperationsService
        .clearBundles(this.authService.currentTenantId, this.route.snapshot.paramMap.get('deploymentId'), 'home/fhir/')
        .subscribe(
          () => {
            this.sharedService.showSuccess('Successfully deleted all uploaded FHIR bundles.');
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

  validateBundles(): void {
    this.dataAfterValidate = 'IN PROCESS';
    this.sub.add(
      this.validateBundles$.subscribe(
        result => {
          if (result) {
            this.dataAfterValidate = {};
            this.dataAfterValidate.invalidBundles = [];
            this.dataAfterValidate.validBundles = [];
            this.dataAfterValidate.invalidCount = result.invalid;
            this.dataAfterValidate.validCount = result.valid;

            result.data.map(item => {
              if (item.response.includes('ERROR')) {
                this.dataAfterValidate.invalidBundles.push({ bundle: item.bundle, response: item.response });
              } else {
                this.dataAfterValidate.validBundles.push({ bundle: item.bundle });
              }
            });

            this.validationCancelled = false;
          }
        },
        error => {
          this.sharedService.showAlert('There was an issue validating your bundles, try again in a few minutes.');
          this.validationCancelled = false;
        },
      ),
    );
  }

  importBundles(): void {
    this.shouldBeImportedBundlesCount = this.currentBundlesCount;
    this.sub.add(
      this.bundleOperationsService
        .importBundles(this.authService.currentTenantId, this.route.snapshot.paramMap.get('deploymentId'), {
          deploymentid: this.route.snapshot.paramMap.get('deploymentId'),
        })
        .pipe(delay(500))
        .subscribe(
          result => {
            this.sharedService.showSuccess(
              'Successfully started bundle import into FHIR service. You can check the result in the import logs.',
            );
            this.refreshToken$.next();
          },
          error => {
            this.sharedService.showAlert('Something went wrong.');
          },
        ),
    );
  }

  uploadBundle(files: Array<FileData>): void {
    this.sub.add(
      from(files)
        .pipe(
          tap(() => this.spinnerService.pushStack('Bundles upload in progress')),
          concatMap(file =>
            this.bundleOperationsService
              .genSignatureAndPolicy(
                this.authService.currentTenantId,
                this.route.snapshot.paramMap.get('deploymentId'),
                { fileName: file.name, fileType: file.type },
              )
              .pipe(
                tap(result => {
                  this.uploadIndividualFileToS3(result, file.content).subscribe(
                    result => {
                      this.spinnerService.popStack();
                      this.sharedService.showSuccess('Files uploaded successfully.');
                      this.refreshToken$.next();
                    },
                    error => {
                      this.spinnerService.popStack();
                      this.sharedService.showAlert('Something went wrong.');
                    },
                  );
                }),
              ),
          ),
        )
        .subscribe(),
    );
  }

  uploadScenario(scenarioId: string): void {
    this.sub.add(
      this.bundleOperationsService
        .uploadScenario(this.authService.currentTenantId, this.route.snapshot.paramMap.get('deploymentId'), {
          scenarioId: scenarioId,
        })
        .pipe(
          tap(() => this.spinnerService.pushStack('Scenario upload in progress')),
          switchMap(result =>
            this.bundleOperationsService
              .getJobs(
                this.authService.currentTenantId,
                this.route.snapshot.paramMap.get('deploymentId'),
                result.loadScenarioJobId,
              )
              .pipe(
                map(value => {
                  if (value.status !== 'SUCCESS') {
                    throw value.status;
                  }
                  this.refreshToken$.next();
                  return value;
                }),
                retryWhen(errors => errors.pipe(delayWhen(() => timer(1000)))),
              ),
          ),
        )
        .subscribe(
          () => {
            this.spinnerService.popStack();
            this.sharedService.showSuccess('Successfully uploaded scenario.');
            this.refreshToken$.next();
          },
          () => {
            this.spinnerService.popStack();
            this.sharedService.showAlert('Something went wrong.');
            this.refreshToken$.next();
          },
        ),
    );
  }

  uploadIndividualFileToS3(signatureAndPolicy, file): Observable<any> {
    const bodyFormData = new FormData();
    for (const key in signatureAndPolicy.fields) {
      bodyFormData.append(key, signatureAndPolicy.fields[key]);
    }
    bodyFormData.append('file', file);
    return this.http.post(signatureAndPolicy.url, bodyFormData);
  }

  showInfo(description: string): void {
    this.sharedService.showInfo(description);
  }

  showAlert(description: string): void {
    this.sharedService.showAlert(description);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
