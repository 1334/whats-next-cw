import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  isLoggedIn: boolean;
  title = "what's next";
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.userLoggedIn.subscribe(
      isLoggedIn => (this.isLoggedIn = isLoggedIn)
    );
  }

  ngOnChange() {
    const res = this.userService.isLoggedIn();
    this.isLoggedIn = res;
  }
}
