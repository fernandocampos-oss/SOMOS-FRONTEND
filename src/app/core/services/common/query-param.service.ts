import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

import { SecurityService } from './security.service';

export enum QueryParamKey {
  ID_SAMPLE = 'idSample',
}

@Injectable({ providedIn: 'root' })
export class QueryParamService {
  constructor(private _securityService: SecurityService) {}

  build(data: object) {
    let encrypted = '';
    try {
      encrypted = this._securityService.encrypt(JSON.stringify(data));
      console.log(data, encrypted);
    } catch (error) {
      console.error(error);
    }
    return { q: encrypted };
  }

  retrieve(data: Params): any {
    let queryParam = {};
    try {
      const decrypted = this._securityService.decrypt(data.q);
      console.log(decrypted);

      queryParam = JSON.parse(decrypted);
    } catch (error) {
      console.error(error);
    }
    return queryParam;
  }
}
