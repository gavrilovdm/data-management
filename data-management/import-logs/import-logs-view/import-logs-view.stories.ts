import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SharedStoryModule } from 'src/app/shared/shared-story.module';

import { ImportLogsViewComponent } from './import-logs-view.component';

export default {
  title: 'Deployment/Data Management/Import Logs',
  component: ImportLogsViewComponent,
  decorators: [
    moduleMetadata({
      imports: [SharedStoryModule],
    }),
  ],
} as Meta;

const Template: Story<ImportLogsViewComponent> = (args: ImportLogsViewComponent) => ({
  props: args,
});

export const Demo = Template.bind({});
Demo.args = {
  importedLogs: [
    {
      attempted: '1',
      created_at: '11/10/2021, 16:25:23',
      data: [
        {
          bundle: 'home/fhir/2021-11-10T16_24_39.142Z-access-logs.json',
          output: `Node: ip-172-31-0-10.us-east-2.compute.internal, Instance: IRISUsername: Password: IRIS:USER>IRIS:%SYS>IRIS:%SYS>1. 2021-11-10T16_24_39.142Z-access-log...  ERROR #5035: General exception Name 'Parsing error' Code '3' Data 'ERROR #5035: General exception Name 'Parsing error' Code '3' Data ''1IRIS:%SYS>`,
        },
      ],
      deploymentid: 'yjol07e5y26k',
      duration: '1.73',
      failed: '1',
      item_type: 'ImportJob',
      jobid: '22afb6ba-3673-4de1-9c84-70d3804dee80',
      status: 'SUCCESS',
      successful: '0',
      updated_at: '11/10/2021, 16:25:25',
    },
    {
      attempted: '0',
      created_at: '11/10/2021, 16:25:28',
      data: [],
      deploymentid: 'yjol07e5y26k',
      duration: '1.23',
      failed: '0',
      item_type: 'ImportJob',
      jobid: '792bcccb-28fa-417b-8363-fe02b9c6cee2',
      status: 'SUCCESS',
      successful: '0',
      updated_at: '11/10/2021, 16:25:29',
    },
  ],
};
export const Empty = Template.bind({});
Empty.args = {
  importedLogs: [],
};
