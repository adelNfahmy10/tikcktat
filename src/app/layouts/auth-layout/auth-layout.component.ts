import {
  Component,
  inject,
  Renderer2,
  type OnDestroy,
  type OnInit,
} from '@angular/core'
import { RouterModule } from '@angular/router'

@Component({
    selector: 'app-auth-layout',
    imports: [RouterModule],
    templateUrl: './auth-layout.component.html',
    styles: ``
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  renderer = inject(Renderer2)

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'authentication-bg')
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'authentication-bg')
  }
}
