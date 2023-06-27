import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AppHeaderComponent } from './components/app-header/app-header.component'
import { HomeComponent } from './pages/home/home.component'
import { ManufacturersComponent } from './pages/manufacturers/manufacturers.component'
import { PrintTableComponent } from './components/print-table/print-table.component'
import { FiltersGutterComponent } from './components/filters-gutter/filters-gutter.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrinterComponent } from './pages/printer/printer.component';
import { PrinterValueComponent } from './components/printer-value/printer-value.component'

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    HomeComponent,
    ManufacturersComponent,
    PrintTableComponent,
    FiltersGutterComponent,
    AppFooterComponent,
    AboutComponent,
    TermsComponent,
    PrinterComponent,
    PrinterValueComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
