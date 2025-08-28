

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router'; 
// import { Gateentry } from './gateentry/gateentry.component';
import { GateentryComponent } from './gateentry/gateentry.component';


const routes: Routes = [
  {
      path: 'gateentry',
      component: GateentryComponent,
      data: { breadcrumb: 'Gate Entry' }
    },
    
  
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class GrnModule { }
