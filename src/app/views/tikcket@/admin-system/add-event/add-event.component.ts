import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth/auth.service';
import { EventService } from '@core/services/event/event.service';
import { UsersService } from '@core/services/users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-event',
  imports: [ReactiveFormsModule],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss'
})
export class AddEventComponent{
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _UsersService = inject(UsersService)
  private readonly _EventService = inject(EventService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)


  allOwners:any[] = []
  selectedFile!: File | null;
  imagePreview: string | ArrayBuffer | null = null;

  ngOnInit(): void {
    this.getAllOwners()
  }

  eventForm:FormGroup = this._FormBuilder.group({
    OwnerId:[null],
    EventName:[null],
    Location:[null],
    LocationName:[null],
    Date:[null],
    TicketCount:[null],
    TicketPrice:[null],
    VisitorPrice:[null],
    EventDetails:[null],
    TermsOfEntries:[null],
    PaymentLink:[null],
    OriganizerName:[null],
    Type:[null],
    Image:[null],
  })

  getAllOwners():void{
    this._NgxSpinnerService.show()

    this._UsersService.getOwners().subscribe({
      next:(res)=>{
        this._NgxSpinnerService.hide()
        this.allOwners = res
      }
    })
  }

  async submitCreateEvent(): Promise<void> {
    this._NgxSpinnerService.show()

    if (this.eventForm.invalid || !this.selectedFile) {
      this.eventForm.markAllAsTouched();
      this._ToastrService.error('Please fill all fields and select image');
      this._NgxSpinnerService.hide()
      return;
    }

    try {

      // 🔥 1. Upload image to Cloudinary
      const imageUrl = await this._EventService.uploadImage(this.selectedFile);

      // 🔥 2. Get form data
      const formValue = this.eventForm.value;

      const eventData = {
        ...formValue,

        // مهم جدًا: نضيف رابط الصورة مش file
        Image: imageUrl,

        // metadata
        createdAt: new Date(),
        status: 'Active'
      };

      // 🔥 3. Save to Firebase
      this._EventService.createEvent(eventData).subscribe({
        next: () => {
          this._ToastrService.success('Event Created Successfully');

          // reset form
          this.eventForm.reset();
          this.imagePreview = null;
          this.selectedFile = null;
        },
        error: (err) => {
          console.error(err);
          this._ToastrService.error('Failed to create event');
        }
      });

    } catch (error) {
      console.error(error);
      this._ToastrService.error('Image upload failed');
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }
}
