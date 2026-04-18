import { httpsCallable } from '@angular/fire/functions';
import { inject, Injectable } from '@angular/core';
import { Functions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly _Functions = inject(Functions)

  scanQR(qrId: string) {
    const scanFn = httpsCallable(this._Functions, 'scanQR');

    scanFn({ qrId }).then((res: any) => {
      console.log(res.data);

      if (res.data.success) {
        alert("✅ Entry allowed");
      } else {
        alert("❌ " + res.data.message);
      }
    });
  }

}
