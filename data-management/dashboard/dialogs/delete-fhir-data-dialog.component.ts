import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormButton, FDN } from '@intersystems/isc-form';
import { Clipboard } from '@angular/cdk/clipboard';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-delete-fhir-data-dialog',
  templateUrl: './delete-fhir-data-dialog.component.html',
  providers: [Clipboard],
})
export class DeleteFhirDataDialogComponent {
  FDN: FDN = {
    name: 'Delete All Fhir® Resources',
    description: `Are you sure you want to delete the following FHIR® Resources?`,
    validateOn: 'change',
    sectionLayout: { showSectionHeaders: false },
    sections: [
      {
        fields: [
          {
            id: 'confirm',
            key: 'confirm',
            type: 'input',
            templateOptions: {
              label: 'Enter Permanently Delete to confirm deletion',
            },
          },
        ],
      },
    ],
  };

  buttons: FormButton[] = [
    {
      id: 'btn-delete',
      text: 'Delete',
      buttonClass: 'primary',
      type: 'submit',
      disabled: (_formModel: any, _formOptions: any, form: any) =>
        form.valueChanges.pipe(map((formModel: any) => formModel.confirm != 'Permanently Delete')),
      callback: () => {
        this.dialogRef.close(true);
      },
    },
    {
      id: 'btn-cancel',
      text: 'Cancel',
      buttonClass: 'secondary',
      type: 'reset',
      callback: () => this.dialogRef.close(false),
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<DeleteFhirDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
  ) {}
}
