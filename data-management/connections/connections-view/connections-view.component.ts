import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SftpServerStatus, UserTenantsTenantid } from 'api';

@Component({
  selector: 'app-connections-view',
  templateUrl: './connections-view.component.html',
  styleUrls: ['./connections-view.component.scss'],
})
export class ConnectionsViewComponent {
  @Input() sftpStatus!: SftpServerStatus;

  @Input() sftpConnectionUrl: string;

  @Input() currentTenantData: UserTenantsTenantid;

  @Output() toggleSftpStatus = new EventEmitter<void>();
  @Output() downloadSftpKey = new EventEmitter<void>();

  onToggleSftpStatus(): void {
    if (this.sftpStatus.status === 'OFFLINE') {
      this.sftpStatus.status = 'STARTING';
    } else if (this.sftpStatus.status === 'ONLINE') {
      this.sftpStatus.status = 'STOPPING';
    }
    this.toggleSftpStatus.emit();
  }
}
