import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '@core/services/event/event.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-event',
  imports: [ReactiveFormsModule],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss'
})
export class AddEventComponent {
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _EventService = inject(EventService)
  private readonly _ToastrService = inject(ToastrService)

  eventForm:FormGroup = this._FormBuilder.group({
    Name:[null],
    Description:[null],
    Location:[null],
    Date:[null],
    Price:[null],
    NumberOfVisitorsAllowed:[null],
    EventDetails:[null],
    TermsOfEntries:[null],
    Type:[null],
    Image:[null],
  })

  imagePreview: string | ArrayBuffer | null = null;

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // نحط الملف في الفورم
      this.eventForm.patchValue({
        Image: file,
      });

      this.eventForm.get('Image')?.updateValueAndValidity();

      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitCheckout(): void {
    const formData = new FormData();
    const formValue = this.eventForm.value;

    Object.keys(formValue).forEach((key) => {
      const value = formValue[key];

      if (value !== null && value !== undefined) {
        if (key === 'Image' && value instanceof File) {
          formData.append('Image', value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    this._EventService.createEvent(formData).subscribe({
      next: (res) => {
        this._ToastrService.success('Create Event Is Successfully')
        this.eventForm.reset()
        this.imagePreview = null
      },
      error: (err) => {
        this._ToastrService.error('Failed Create Event')
      }
    });
  }

}
