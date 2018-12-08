import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShowListComponent } from './components/show-list/show-list.component';
import { ShowListItemComponent } from './components/show-list/show-list-item/show-list-item.component';
import { SimilarShowsComponent } from './components/show-details/similar-shows/similar-shows.component';
import { RatingsComponent } from './components/utils/ratings/ratings.component';
import { SearchComponent } from './components/search/search.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import { ShowDetailsComponent } from './components/show-details/show-details.component';
import { MyShowsComponent } from './components/my-shows/my-shows.component';
import { TrackSeenComponent } from './components/utils/track-seen/track-seen.component';
import { TrackToSeeComponent } from './components/utils/track-to-see/track-to-see.component';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from 'angular-6-social-login';

export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider("295087824459443")
        }
      ]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    RecommendationsComponent,
    MyShowsComponent,
    ShowListComponent,
    ShowListItemComponent,
    ShowDetailsComponent,
    SimilarShowsComponent,
    TrackSeenComponent,
    TrackToSeeComponent,
    RatingsComponent,
    SearchComponent,
    MainComponent,
    LoginComponent
  ],
  imports: [AppRoutingModule, BrowserModule, FormsModule, HttpClientModule, SocialLoginModule],
  providers: [{provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs}],
  bootstrap: [AppComponent]
})
export class AppModule {}
