import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DeploymentsService } from '../../../deployments.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../../shared/services/shared.service';
import { delay, map, repeatWhen, switchMap, takeWhile } from 'rxjs/operators';
import { AuthService } from '../../../../core/auth.service';
import { ConnectionsService, SftpServerStatus, UserTenantsTenantid } from 'api';

@Component({
  selector: 'app-connections',
  templateUrl: './connections-page.component.html',
  styleUrls: ['./connections-page.component.scss'],
})
export class ConnectionsPageComponent implements OnInit, OnDestroy {
  refreshToken$ = new BehaviorSubject<void>(undefined);

  public sftpStatus$: Observable<SftpServerStatus>;

  public sftpStatus: SftpServerStatus;

  public sftpConnectionUrl$: Observable<string | undefined>;

  public currentTenantData: UserTenantsTenantid;

  private sub = new Subscription();

  constructor(
    private deploymentsService: DeploymentsService,
    private connectionsService: ConnectionsService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.sftpStatus$ = this.refreshToken$.pipe(
      switchMap(() =>
        this.connectionsService
          .getSftpServerStatus(this.authService.currentTenantId, this.route.snapshot.paramMap.get('deploymentId'))
          .pipe(
            repeatWhen(obs => obs.pipe(delay(5000))),
            takeWhile(value => value.status !== 'ONLINE' && value.status !== 'OFFLINE', true),
          ),
      ),
      map(data => {
        return data ? (this.sftpStatus = data) : undefined;
      }),
    );

    this.sftpConnectionUrl$ = this.refreshToken$.pipe(
      switchMap(() => this.deploymentsService.deployment$(this.route.snapshot.paramMap.get('deploymentId'))),
      map((data: any) => {
        return data ? data.resource_list?.sftpconnectionurl : undefined;
      }),
    );

    this.currentTenantData = this.authService.getCurrentTenantData();
  }

  toggleSftpStatus(): void {
    this.sub.add(
      this.connectionsService
        .toggleSftpServerStatus(this.authService.currentTenantId, this.route.snapshot.paramMap.get('deploymentId'), {})
        .pipe(delay(1000))
        .subscribe(
          () => {
            this.refreshToken$.next();
          },
          () => {
            this.sharedService.showAlert('Error toggling your sftp server. Please try again later.');
          },
        ),
    );
  }

  downloadSftpKey(): void {
    const secretName = 'isc-msp-' + this.route.snapshot.paramMap.get('deploymentId') + '-key';
    this.connectionsService
      .getResources('getsecret', this.route.snapshot.paramMap.get('deploymentId'), secretName, 'sftp_key')
      .pipe(
        map((key: any) => {
          const fileURL = window.URL.createObjectURL(new Blob([key]));
          const fileLink = document.createElement('a');
          const keyName = this.route.snapshot.paramMap.get('deploymentId') + '-sftp-key';
          const keyNameWithExt = keyName.replace(/\s+/g, '') + '.pem';
          fileLink.href = fileURL;
          fileLink.setAttribute('download', keyNameWithExt);
          document.body.appendChild(fileLink);

          fileLink.click();
        }),
      )
      .subscribe(
        result => result,
        () => {
          this.sharedService.showAlert('Error toggling your sftp server. Please try again later.');
        },
      );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
