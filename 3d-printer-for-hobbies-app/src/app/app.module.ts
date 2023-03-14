import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AppHeaderComponent } from './components/app-header/app-header.component'
import { HomeComponent } from './components/home/home.component'
import { ManufacturersComponent } from './components/manufacturers/manufacturers.component';
import { PrintTableComponent } from './components/print-table/print-table.component'

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    HomeComponent,
    ManufacturersComponent,
    PrintTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
