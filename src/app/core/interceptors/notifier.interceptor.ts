import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '@core/services/common/notification.service';

@Injectable()
export class NotifierInterceptor implements HttpInterceptor {
  constructor(private _notification: NotificationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        switch (response.status) {
          case 0:
            this._notification.error(
              'No se pudo acceder al servidor. Verifique su conexión a internet.'
            );
            break;
          case HttpStatusCode.BadRequest:
            const message = response?.error?.message;
            if (message) {
              this._notification.warning(message);
            }
            break;
          case HttpStatusCode.InternalServerError:
            this._notification.error('Error al procesar información.');
            break;
          case HttpStatusCode.NotFound:
            // TODO: Redireccionar a página 404
            this._notification.error('Recurso no encontrado.');
            break;
        }
        return throwError(response);
      })
    );
  }
}
