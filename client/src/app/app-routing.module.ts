import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { MyTvShowsComponent } from './my-tv-shows/my-tv-shows.component';
import { ShowDetailsComponent } from './show-details/show-details.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: 'recommendations', component: RecommendationsComponent },
  { path: 'my-tv-shows', component: MyTvShowsComponent },
  { path: 'search', component: SearchComponent },
  { path: 'shows/:showId', component: ShowDetailsComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
