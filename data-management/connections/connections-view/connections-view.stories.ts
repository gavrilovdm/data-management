import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SharedStoryModule } from 'src/app/shared/shared-story.module';

import { ConnectionsViewComponent } from './connections-view.component';

export default {
  title: 'Deployment/Data Management/Connections',
  component: ConnectionsViewComponent,
  decorators: [
    moduleMetadata({
      imports: [SharedStoryModule],
    }),
  ],
} as Meta;

const Template: Story<ConnectionsViewComponent> = (args: ConnectionsViewComponent) => ({
  props: args,
});

export const Enabled = Template.bind({});
Enabled.args = {
  sftpStatus: { enabled: true, status: 'ONLINE' },
  sftpConnectionUrl: 'sftp -i 2qf7sonz2155-sftp-key.pem 2qf7sonz2155@sftp.2qf7sonz2155.static-test-account.isccloud.io',
  currentTenantData: { role: 'admin' }
};
export const Disabled = Template.bind({});
Disabled.args = {
  sftpStatus: { enabled: false, status: 'OFFLINE' },
  currentTenantData: { role: 'admin' }
};
export const Running = Template.bind({});
Running.args = {
  sftpStatus: { enabled: false, status: 'STARTING' },
  currentTenantData: { role: 'admin' }
};
export const Stopping = Template.bind({});
Stopping.args = {
  sftpStatus: { enabled: false, status: 'STOPPING' },
  currentTenantData: { role: 'admin' }
};
