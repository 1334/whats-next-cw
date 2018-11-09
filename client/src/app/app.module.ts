import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { MyTvShowsComponent } from './my-tv-shows/my-tv-shows.component';
import { ShowListItemComponent } from './show-list-item/show-list-item.component';
import { ShowDetailsComponent } from './show-details/show-details.component';
import { SimilarShowsComponent } from './show-details/similar-shows/similar-shows.component';
import { TrackShowComponent } from './utils/track-show/track-show.component';
import { RatingsComponent } from './utils/ratings/ratings.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    RecommendationsComponent,
    MyTvShowsComponent,
    ShowListItemComponent,
    ShowDetailsComponent,
    SimilarShowsComponent,
    TrackShowComponent,
    RatingsComponent,
    SearchComponent
  ],
  imports: [AppRoutingModule, BrowserModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
