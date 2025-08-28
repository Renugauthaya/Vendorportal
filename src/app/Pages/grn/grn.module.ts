

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router'; 
<<<<<<< HEAD
// import { Gateentry } from './gateentry/gateentry.component';
import { GateentryComponent } from './gateentry/gateentry.component';
=======
import { PoComponent } from '../po/po/po.component';
>>>>>>> 469215cf1f4d3d8ee70ca8fbf48a21e1f94cb9ca


const routes: Routes = [
  {
      path: 'gateentry',
<<<<<<< HEAD
      component: GateentryComponent,
=======
      component: PoComponent,
>>>>>>> 469215cf1f4d3d8ee70ca8fbf48a21e1f94cb9ca
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
