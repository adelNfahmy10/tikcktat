import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
    selector: 'app-logo-box',
    imports: [RouterLink, CommonModule],
    template: `
    <div [class]="className">
      <a routerLink="/" class="logo-dark">
        @if (size) {
          <img src="assets/images/tikecktImages/logos/ticketat-logo-3.png" class="logo-sm" alt="logo sm" />
          <img
            src="assets/images/tikecktImages/logos/ticketat-logo-3.png"
            class="logo-lg"
            alt="logo dark"
          />
        } @else {
          <div class="p-3 border border-2 rounded bg-light-subtle">
            <img src="assets/images/tikecktImages/logos/ticketat-logo-3.png" height="50" alt="logo dark" />
          </div>
        }
      </a>

      <a routerLink="/" class="logo-light">
        @if (size) {
          <img src="assets/images/tikecktImages/logos/ticketat-logo-3.png" class="logo-sm" alt="logo sm" />
          <img
            src="assets/images/tikecktImages/logos/ticketat-logo-3.png"
            class="logo-lg"
            alt="logo light /////////////"
          />
        } @else {
          <div class="p-3 border border-2 rounded bg-light-subtle">
            <img src="assets/images/tikecktImages/logos/ticketat-logo-3.png" height="50" alt="logo dark" />
          </div>
        }
      </a>
    </div>
  `
})
export class LogoBoxComponent {
  @Input() className: string = ''
  @Input() size: boolean = false
}
