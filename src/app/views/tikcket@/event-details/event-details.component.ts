import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { accordionItem } from '@views/ui/accordion/data';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-event-details',
  imports: [CommonModule, NgbAccordionModule, RouterLink],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent {
accordionData = accordionItem
}
