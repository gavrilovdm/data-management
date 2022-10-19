import { Story, Meta } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SharedStoryModule } from 'src/app/shared/shared-story.module';

import { BundleOperationsViewComponent } from './bundle-operations-view.component';

export default {
  title: 'Deployment/Data Management/Bundle Operations',
  component: BundleOperationsViewComponent,
  decorators: [
    moduleMetadata({
      imports: [SharedStoryModule],
    }),
  ],
} as Meta;

const Template: Story<BundleOperationsViewComponent> = (args: BundleOperationsViewComponent) => ({
  props: args,
});

export const Data = Template.bind({});
Data.args = {
  importedBundlesData: { ccda: 0, fhir: 28, hl7: 0, sda3: 0 },
  currentTenantData: { role: 'admin' }
};
export const DataAfterValidate = Template.bind({});
DataAfterValidate.args = {
  importedBundlesData: { ccda: 0, fhir: 28, hl7: 0, sda3: 0 },
  dataAfterValidate: {
    invalidBundles: [
      {
        bundle: 'home/fhir/2021-11-03T19_34_58.502Z-access-logs.json',
        response: 'ERROR <HSFHIRErr>APIContractViolation: Invalid arguments in API method invocation: pResourceObject',
      },
    ],
    validBundles: [
      { bundle: 'home/fhir/Arianne988_Muller251_6e485b00-b00e-46df-9863-fe1ef0c69895.json' },
      { bundle: 'home/fhir/Ben667_Conroy74_48b5c835-fe49-46ea-805d-f855082ec07d.json' },
      { bundle: 'home/fhir/Charise827_Balistreri607_63468dd7-5ebe-4174-af34-fb1a10998b6b.json' },
      { bundle: 'home/fhir/Darrell400_Bergstrom287_438f0bec-ecfd-49a2-87e3-e17bc9573acc.json' },
      { bundle: 'home/fhir/Dominica520_McLaughlin530_ba4697e9-b01a-47c1-ab6b-47ab00f420e2.json' },
      { bundle: 'home/fhir/Donnell534_Kozey370_bbbafa22-8267-4750-9d51-e7d6276b8618.json' },
      { bundle: 'home/fhir/Elisa944_Almonte426_660e497c-5985-4924-b187-8dda62546476.json' },
      { bundle: 'home/fhir/Enrique929_Waelchi213_ea3cea9e-ba2f-4a24-be74-687f49e0903e.json' },
      { bundle: 'home/fhir/Kenneth671_Bednar518_c1423583-a529-4596-8d43-ec3391d41811.json' },
      { bundle: 'home/fhir/Kiera822_Steuber698_d0b2c3fe-fe1e-4840-a1ad-af2122c82948.json' },
      { bundle: 'home/fhir/Lennie123_Schinner682_92e9fea7-22a0-4831-bc2e-8d747150fbfd.json' },
      { bundle: 'home/fhir/Lindsay928_Durgan499_4db74faa-8ccb-47bd-bf67-1b036d70ba15.json' },
      { bundle: 'home/fhir/Logan497_Haley279_0ab8c3b4-7ce5-42c3-83b1-3fbf13a3bb38.json' },
      { bundle: 'home/fhir/Magaly973_Mueller846_7e527151-1a63-48f9-88b6-eac4ea95d4c7.json' },
      { bundle: 'home/fhir/Marcela739_Ratke343_85b76c3e-1208-437e-b4ea-88abeab87eaa.json' },
      { bundle: 'home/fhir/Mario764_Dibbert990_f6041298-5ab1-4803-bf26-eb39ca20ac24.json' },
      { bundle: 'home/fhir/Marisol435_Fernández399_d673af1f-b8bc-4530-9db5-2362f4e10627.json' },
      { bundle: 'home/fhir/Maryland870_Mayer370_93500c39-54a1-4963-a549-a47042d41930.json' },
      { bundle: 'home/fhir/Moises22_Schumm995_af8a1550-29c4-4687-8451-abadbebfc1d4.json' },
      { bundle: 'home/fhir/Numbers230_Schmidt332_8a7885f0-58cb-4384-a0ca-721bfbe2b11e.json' },
      { bundle: 'home/fhir/Rubén780_Sanches349_db76b64d-8ed3-4d2c-ae9a-df2cb6336ca1.json' },
      { bundle: 'home/fhir/Sade71_Franecki195_b8de609d-9fa9-4572-a856-6171d673bf1d.json' },
      { bundle: 'home/fhir/Stevie682_Kuhlman484_6899618b-531d-48be-b4d3-fad10c2684f1.json' },
      { bundle: 'home/fhir/Takako793_Fisher429_db4c2967-d8a5-491a-940e-0c5a71973b2c.json' },
      { bundle: 'home/fhir/Teodoro374_Peres371_b65d9065-80d6-4808-9977-9fa2b6a58dbf.json' },
      { bundle: 'home/fhir/Winnifred2_Upton904_c2f18bf2-7fc3-4da4-84b7-cc09215fd498.json' },
      { bundle: 'home/fhir/hospitalInformation1597107331123.json' },
      { bundle: 'home/fhir/practitionerInformation1597107331123.json' },
    ],
    invalidCount: '1',
    validCount: '28',
  },
  currentTenantData: { role: 'admin' }
};
export const Empty = Template.bind({});
Empty.args = {
  importedBundlesData: { ccda: 0, fhir: 0, hl7: 0, sda3: 0 },
  currentTenantData: { role: 'admin' }
};
