import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/header/header.component";
import { CommonService } from './services/common.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent], // Removed HttpClientModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Hoodies';
  constructor(public commonService:CommonService){}
  public isLogged = false;
  ngOnInit(): void {
      this.isLogged = !!this.commonService.returnToken();
  }
}
