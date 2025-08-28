import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmailtemplateComponent } from './emailtemplate/emailtemplate.component';
import { NumberrangesettingsComponent } from './numberrangesettings/numberrangesettings.component';
import { OutgoingEmailSettingsComponent } from './outgoing-email-settings/outgoing-email-settings.component';
import { UploaddocumentsettingsComponent } from './uploaddocumentsettings/uploaddocumentsettings.component';

const routes: Routes = [
  {
      path: 'emailtemplate',
      component: EmailtemplateComponent,
      data: { breadcrumb: 'Email Template' }
    },
    {
      path: 'numberrangesettings',
      component: NumberrangesettingsComponent,
      data: { breadcrumb: 'Number Range Settings' }
    },
    {
      path: 'outgoingemailsettings',
      component: OutgoingEmailSettingsComponent,
      data: { breadcrumb: 'Outgoing Email Settings' }
    },
    {
      path: 'uploaddocumentsettings',
      component: UploaddocumentsettingsComponent,
      data: { breadcrumb: 'Upload Document Settings' }
    },
 
  
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class AdministrationModule { }
