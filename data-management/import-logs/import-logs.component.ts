import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../../shared/services/shared.service';
import { ImportLogsService, ImportOrValidateJobObject } from 'api';
import { AuthService } from '../../../../core/auth.service';

@Component({
  selector: 'app-import-logs',
  templateUrl: './import-logs.component.html',
  styleUrls: ['./import-logs.component.scss'],
})
export class ImportLogsComponent implements OnInit {
  refreshToken$ = new BehaviorSubject<void>(undefined);

  public importedLogs$: Observable<ImportOrValidateJobObject[]>;

  constructor(
    private importLogsService: ImportLogsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.importedLogs$ = this.refreshToken$.pipe(
      switchMap(() =>
        this.importLogsService.getJobsLogs(
          this.authService.currentTenantId,
          this.route.snapshot.paramMap.get('deploymentId'),
          'ImportJob',
        ),
      ),
      map(data => {
        return data ? data.sort((one, two) => Date.parse(two.updated_at) - Date.parse(one.updated_at)) : undefined;
      }),
    );
  }

  downloadImportLog(data: Record<string, unknown>): void {
    const filename = new Date().toISOString() + '-imported-logs.json';
    const url = this.sharedService.generateDownloadJsonUrl(data);
    const a = document.createElement('a');

    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    if (typeof url === 'string') {
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }
}
