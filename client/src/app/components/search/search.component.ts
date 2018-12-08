import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { ApiClientService } from '../../services/api-client.service';
import SearchResult from '../../models/search-result';
import { SearchResultsService } from 'src/app/services/search-results.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchText;
  results: SearchResult[] = [];
  searching = false;

  constructor(
    private apiClient: ApiClientService,
    private resultsService: SearchResultsService
  ) {
    this.searchText = resultsService.searchText;
    this.results = resultsService.results;
  }

  ngOnInit() {
    // this.searching = false;
    const inputElm = document.getElementById('searchTextField');
    fromEvent(inputElm, 'keyup')
      .pipe(
        debounceTime(500),
        filter(() => this.searchText.length >= 2)
      )
      .subscribe(() => {
        this.apiClient.searchTerm(this.searchText).subscribe(results => {
          this.searching = false;
          this.results = results;
          this.resultsService.results = results;
          this.resultsService.searchText = this.searchText;
        });
      });
  }

  keyPressed() {
    if (this.searchText != '') this.searching = true;
  }
}
