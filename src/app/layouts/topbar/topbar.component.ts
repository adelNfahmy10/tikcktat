import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Inject,
  inject,
  Output,
} from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { changetheme } from '@store/layout/layout-action'
import { getLayoutColor } from '@store/layout/layout-selector'
import { SimplebarAngularModule } from 'simplebar-angular'
import { notificationsData } from './data'
import { DOCUMENT } from '@angular/common'
import { logout } from '@store/authentication/authentication.actions'

type FullScreenTypes = {
  requestFullscreen?: () => Promise<void>
  mozRequestFullScreen?: () => Promise<void>
  mozCancelFullScreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
  webkitExitFullscreen?: () => Promise<void>
  mozFullScreenElement?: Element
  msFullscreenElement?: Element
  webkitFullscreenElement?: Element
  msRequestFullscreen?: () => Promise<void>
  mozRequestFullscreen?: () => Promise<void>
  webkitRequestFullscreen?: () => Promise<void>
}

@Component({
    selector: 'app-topbar',
    imports: [SimplebarAngularModule, NgbDropdownModule, RouterLink],
    templateUrl: './topbar.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TopbarComponent {
  notificationList = notificationsData
  element!: FullScreenTypes

  @Output() settingsButtonClicked = new EventEmitter()
  @Output() mobileMenuButtonClicked = new EventEmitter()

  router = inject(Router)
  store = inject(Store)

  constructor(@Inject(DOCUMENT) private document: Document & FullScreenTypes) {
    this.element = this.document.documentElement as FullScreenTypes
  }

  settingMenu() {
    this.settingsButtonClicked.emit()
  }

  toggleMobileMenu() {
    this.mobileMenuButtonClicked.emit()
  }

  changeTheme() {
    const color = document.documentElement.getAttribute('data-bs-theme')
    if (color == 'light') {
      this.store.dispatch(changetheme({ color: 'dark' }))
    } else {
      this.store.dispatch(changetheme({ color: 'light' }))
    }
    this.store.select(getLayoutColor).subscribe((color) => {
      document.documentElement.setAttribute('data-bs-theme', color)
    })
  }

  fullscreen() {
    document.body.classList.toggle('fullscreen-enable')
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen()
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen()
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen()
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen()
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen()
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen()
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen()
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen()
      }
    }
  }

  logout() {
    this.store.dispatch(logout())
  }
}
