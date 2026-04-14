import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '@core/services/event/event.service';
import { UsersService } from '@core/services/users/users.service';

@Component({
  selector: 'app-available-events',
  imports: [CommonModule, RouterLink],
  templateUrl: './available-events.component.html',
  styleUrl: './available-events.component.scss'
})
export class AvailableEventsComponent {
  private readonly _EventService = inject(EventService)
  private readonly _UsersService = inject(UsersService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  allEvents:any[] = [];
  category:string = '';
  allOwners: any[] = [];
  eventsWithOwnerName: any[] = [];

  ngOnInit() {
    this.getAllOwners()
    this.getAllEvent()

  }

  getAllEvent(): void {
    this._ActivatedRoute.params.subscribe(params => {
      this.category = params['type'];
      this._EventService.getAllEvents().subscribe({
        next: (res) => {

          this.allEvents = res.filter(e => e.Type === this.category);
          this.mergeData();
        }
      });
    })

  }

  getAllOwners(): void {
    this._UsersService.getOwners().subscribe(res => {
      this.allOwners = res;
      this.mergeData();
    });
  }

  mergeData(): void {
    if (!this.allEvents.length || !this.allOwners.length) return;

    const ownersMap = new Map(
      this.allOwners.map(o => [o.uid, o.fullName])
    );

    this.eventsWithOwnerName = this.allEvents.map(event => ({
      ...event,
      ownerName: ownersMap.get(event.OwnerId) || 'Unknown'
    }));
  }
}
