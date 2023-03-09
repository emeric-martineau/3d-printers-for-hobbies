import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './components/home/home.component'
import { ManufacturersComponent } from './components/manufacturers/manufacturers.component'


const routes: Routes = [
  {
    path: 'manufacturers',
    component: ManufacturersComponent
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
