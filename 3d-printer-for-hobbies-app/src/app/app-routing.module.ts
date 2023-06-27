import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './pages/home/home.component'
import { ManufacturersComponent } from './pages/manufacturers/manufacturers.component'
import { AboutComponent } from './pages/about/about.component'
import { TermsComponent } from './pages/terms/terms.component'
import { PrinterComponent } from './pages/printer/printer.component'


const routes: Routes = [
  {
    path: 'manufacturers',
    component: ManufacturersComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'terms',
    component: TermsComponent
  },
  {
    path: 'printer/:id',
    component: PrinterComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  /*{
    path: '**',
    component: PageNotFoundComponent
  },*/
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
