import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnChanges {

  @Input() loading = false;
  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges(): void {
  }

}
