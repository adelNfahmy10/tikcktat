import { Component } from '@angular/core'
import { customersCountryData } from '../../data'
import { WorldVectorMapComponent } from '@component/vector-maps/world-vector-map.component'

import 'jsvectormap'
import 'jsvectormap/dist/maps/world'

@Component({
    selector: 'customer-by-country',
    imports: [WorldVectorMapComponent],
    templateUrl: './customer-by-country.component.html',
    styles: ``
})
export class CustomerByCountryComponent {
  countryList = customersCountryData

  worldMapConfig = {
    map: 'world',
    selector: '#world-map-markers',
    zoomOnScroll: false,
    zoomButtons: !1,
    markersSelectable: !1,
    markers: [
      { name: 'Greenland', coords: [72, -42] },
      { name: 'Canada', coords: [56.1304, -106.3468] },
      { name: 'Brazil', coords: [-14.235, -51.9253] },
      { name: 'Egypt', coords: [26.8206, 30.8025] },
      { name: 'Russia', coords: [61, 105] },
      { name: 'China', coords: [35.8617, 104.1954] },
      { name: 'United States', coords: [37.0902, -95.7129] },
      { name: 'Norway', coords: [60.472024, 8.468946] },
      { name: 'Ukraine', coords: [48.379433, 31.16558] },
    ],
    markerStyle: {
      initial: { fill: '#5B8DEC' },
      selected: { fill: '#ed5565' },
    },
    labels: {
      markers: {
        render: (marker: any) => marker.name,
      },
    },
    regionStyle: {
      initial: {
        fill: 'rgba(169,183,197, 0.3)',
        fillOpacity: 1,
      },
    },
  }
}
