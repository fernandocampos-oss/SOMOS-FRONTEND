import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoadingService } from '../services/ui/loading.service';

export const LoadingInterceptorSkipHeader = 'X-Loading-Skip-Interceptor';
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private _countRequest = 0;
  constructor(private _spinner: LoadingService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.headers.has(LoadingInterceptorSkipHeader)) {
      const headers = request.headers.delete(LoadingInterceptorSkipHeader);
      return next.handle(request.clone({ headers }));
    }

    if (!this._countRequest) {
      this._spinner.show();
    }
    this._countRequest++;
    return next.handle(request).pipe(
      finalize(() => {
        this._countRequest--;
        if (!this._countRequest) {
          this._spinner.hide();
        }
      })
    );
  }
}
