import { NgModule }                 from '@angular/core';
import { MatButtonModule }          from '@angular/material/button';
import { MatFormFieldModule}        from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule }            from '@angular/material/icon';
import { MatCardModule }            from '@angular/material/card';
import { MatTableModule }           from '@angular/material/table';
const MaterialComponents=[
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatCardModule,
  MatTableModule
]
@NgModule({
  imports:      [ MaterialComponents],
  exports:      [ MaterialComponents],
})
export class MaterialModule { }
