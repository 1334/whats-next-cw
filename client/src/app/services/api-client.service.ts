import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import Show from '../models/show';
import User from '../models/user';
import SearchResult from '../models/search-result';
import { environment } from 'src/environments/environment';
import Tracking from '../interfaces/tracking';
import TrackingResult from '../interfaces/tracking-result';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  baseUrl = environment.serverUrl;

  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http
      .get<User>(`${this.baseUrl}/user`)
      .pipe(map(user => User.from(user)));
  }

  getRecommendedShows(): Observable<Show[]> {
    return this.http.get<Show[]>(`${this.baseUrl}/recommended`).pipe(
      map(data =>
        data.map(show => {
          show.recommendations = show.recommendations.map(show =>
            Show.from(show)
          );
          return Show.from(show);
        })
      )
    );
  }

  getTVShowDetails(id: number): Observable<Show> {
    return this.http.get<Show>(`${this.baseUrl}/shows/${id}`).pipe(
      map(show => {
        show.similar = show.similar.map(show => Show.from(show));
        show.recommendations = show.recommendations.map(show =>
          Show.from(show)
        );
        show.status = (show.tracking && show.tracking.status) || '';
        show.rating = (show.tracking && show.tracking.rating) || 0;
        show.isTracked = !!show.status;
        return Show.from(show);
      })
    );
  }

  searchTerm(term: string): Observable<SearchResult[]> {
    return this.http.post<SearchResult[]>(`${this.baseUrl}/shows/search`, {
      term
    });
  }

  postRating(tracking: Tracking): Observable<TrackingResult> {
    return this.http.post<TrackingResult>(
      `${this.baseUrl}/user/${tracking.showId}/rate`,
      tracking
    );
  }

  postStatus(tracking: Tracking): Observable<Show> {
    return this.http
      .post<Show>(`${this.baseUrl}/user/${tracking.showId}/status`, tracking)
      .pipe(
        map(show => {
          show.similar = show.similar.map(show => Show.from(show));
          show.status = (show.tracking && show.tracking.status) || '';
          show.rating = (show.tracking && show.tracking.rating) || 0;
          show.isTracked = !!show.status;
          return Show.from(show);
        })
      );
  }
}
