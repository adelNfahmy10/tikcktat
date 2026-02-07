import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const _PLATFORM_ID = inject(PLATFORM_ID)
  const _Router = inject(Router)
  const _AuthService = inject(AuthService)

  if(isPlatformBrowser(_PLATFORM_ID)){
    if(localStorage.getItem('token') !== null){
      req = req.clone({
        setHeaders: {Authorization: `Bearer ${localStorage.getItem('token')}`}
      })
    }
  }

  return next(req).pipe(catchError((err) => {
    if (err.status === 401 || err.error?.msg === "Unauthorized") {
        let data = {
          accessToken: localStorage.getItem('token')!,
          refreshToken: localStorage.getItem('refreshToken')!
        };
       return _AuthService.refreshToken(data).pipe(
        switchMap((res: any) => {
            if (res && res.data) {
              // ✅ حفظ التوكينات الجديدة
              localStorage.setItem('token', res.data.accessToken);
              if (res.data.refreshToken) {
                localStorage.setItem('refreshToken', res.data.refreshToken);
              }

              // ✅ إعادة إرسال الطلب الأصلي
              const updatedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.data.accessToken}` },
              });

              return next(updatedReq);
            } else {
              _Router.navigate(['/home'])
              return throwError(() => new Error('Unable to refresh token.'));
            }
          }),
      );
      } else {
        return throwError(() => err);
      }
    })
  );
};
