import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: '', redirectTo: 'splash', pathMatch: 'full'},
  { path: 'splash', loadChildren: () => import('./app.component').then( m => m.AppComponent)},
  { path: 'login', loadChildren: () => import('./componentes/login/login.module').then( m => m.LoginPageModule)},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }