import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackingComponent } from './pages/tracking/tracking.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tracking',
    pathMatch: 'full',
  },
  {
    path: 'tracking',
    component: TrackingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
