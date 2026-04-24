import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    this.addDepartment()
  }

  eventForm:FormGroup = this._FormBuilder.group({
    OwnerId:[null, [Validators.required]],
    EventName:[null, [Validators.required]],
    Location:[null, [Validators.required]],
    LocationName:[null, [Validators.required]],
    Date:[null, [Validators.required]],
    TicketCount:[null, [Validators.required]],
    TicketPrice:[null, [Validators.required]],
    VisitorPrice:[null, [Validators.required]],
    EventDetails:[null, [Validators.required]],
    TermsOfEntries:[null, [Validators.required]],
    PaymentLink:[null, [Validators.required]],
    OriganizerName:[null, [Validators.required]],
    Type:[null, [Validators.required]],
    PaidPhases:[null, [Validators.required]],
    deposit:[null, [Validators.required]],
    departments: this._FormBuilder.array([]),
    Image:[null],
  })

  get departments(): FormArray {
    return this.eventForm.get('departments') as FormArray;
  }

  addDepartment() {
    this.departments.push(this._FormBuilder.control('', Validators.required));
  }

  removeDepartment(index: number) {
    this.departments.removeAt(index);
  }

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
    this._NgxSpinnerService.show();

    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      this._ToastrService.error('Invalid Event Data');
      this._NgxSpinnerService.hide()
      return;
    }

    try {

      // 🔥 1. Upload image to Cloudinary
      const imageUrl = await this._EventService.uploadImage(this.selectedFile!);

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
