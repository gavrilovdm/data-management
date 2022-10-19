import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SharedStoryModule } from 'src/app/shared/shared-story.module';

import { DashboardViewComponent } from './dashboard-view.component';

export default {
  title: 'Deployment/Data Management/Dashboard',
  component: DashboardViewComponent,
  decorators: [
    moduleMetadata({
      imports: [SharedStoryModule],
    }),
  ],
} as Meta;

const Template: Story<DashboardViewComponent> = (args: DashboardViewComponent) => ({
  props: args,
});

export const Demo = Template.bind({});
Demo.args = {
  resourcesData: {
    diskSpace: '11',
    totalAllResources: [
      {
        rcount: 9,
        resource: 'AllergyIntolerance',
      },
      {
        rcount: 59,
        resource: 'CarePlan',
      },
      {
        rcount: 59,
        resource: 'CareTeam',
      },
      {
        rcount: 1326,
        resource: 'Claim',
      },
      {
        rcount: 149,
        resource: 'Condition',
      },
      {
        rcount: 168,
        resource: 'DiagnosticReport',
      },
      {
        rcount: 876,
        resource: 'Encounter',
      },
      {
        rcount: 876,
        resource: 'ExplanationOfBenefit',
      },
      {
        rcount: 49,
        resource: 'Goal',
      },
      {
        rcount: 6,
        resource: 'ImagingStudy',
      },
      {
        rcount: 325,
        resource: 'Immunization',
      },
      {
        rcount: 450,
        resource: 'MedicationRequest',
      },
      {
        rcount: 2847,
        resource: 'Observation',
      },
      {
        rcount: 140,
        resource: 'Organization',
      },
      {
        rcount: 26,
        resource: 'Patient',
      },
      {
        rcount: 140,
        resource: 'Practitioner',
      },
      {
        rcount: 603,
        resource: 'Procedure',
      },
    ],
    totalOrganizations: 140,
    totalPatients: 26,
    totalPractitioners: 140,
    totalResources: 8108,
  },
  currentTenantData: { role: 'admin' }
};
export const Empty = Template.bind({});
Empty.args = {
  resourcesData: {
    diskSpace: '11',
    totalAllResources: [],
    totalOrganizations: 0,
    totalPatients: 0,
    totalPractitioners: 0,
    totalResources: 0,
  },
  currentTenantData: { role: 'admin' }
};
