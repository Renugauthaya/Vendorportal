

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router'; 
import { PoComponent } from '../po/po/po.component';


const routes: Routes = [
  {
      path: 'gateentry',
      component: PoComponent,
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
