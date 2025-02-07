import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Tag } from 'primeng/tag';
import { Rating } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
const primeNg = [ButtonModule,FormsModule, ReactiveFormsModule,InputGroupModule,InputGroupAddonModule,TableModule, Tag, ToastModule, Rating]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    primeNg
  ],
  exports:[primeNg]
})
export class PrimeNgModule { }
