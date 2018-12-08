import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import { MyShowsComponent } from './components/my-shows/my-shows.component';
import { SearchComponent } from './components/search/search.component';
import { ShowDetailsComponent } from './components/show-details/show-details.component';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth-guard.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'recommendations', component: RecommendationsComponent, canActivate: [AuthGuard] },
  { path: 'my-shows', redirectTo: 'my-shows/toSee', canActivate: [AuthGuard] },
  { path: 'my-shows/toSee', component: MyShowsComponent, canActivate: [AuthGuard] },
  { path: 'my-shows/seeing', redirectTo: 'my-shows/toSee', canActivate: [AuthGuard] },
  { path: 'my-shows/seen', component: MyShowsComponent, canActivate: [AuthGuard] },
  { path: 'my-shows/:showId', component: ShowDetailsComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'shows/:showId', component: ShowDetailsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full', canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
