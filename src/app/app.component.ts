import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'invoice-website-root',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  #router = inject(Router);
  ngOnInit() {
    this.#router.navigate(['/loading']);
  }
}
