import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './components/home/home.component'
import { ManufacturersComponent } from './components/manufacturers/manufacturers.component'
import { AboutComponent } from './components/about/about.component'
import { TermsComponent } from './components/terms/terms.component'


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
