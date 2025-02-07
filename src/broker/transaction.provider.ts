import { Injectable, Scope } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { EntityManager } from 'typeorm';

{
  /*
    - The TransactionProvider class is essentially a storage system that holds onto a database manager (EntityManager) for the duration of a single web request.
    - he decoration @Injectable({ scope: Scope.REQUEST }) means: 
    
    - A new instance is created for each web request
    - It's not shared between different requests
    - Dies when the request is finished
    - Keeps data separate for each request
    - Prevents data from one user's request mixing with another's
    - When a request comes in, it gets its own locker (new TransactionProvider instance)
   */
}

@Injectable({ scope: Scope.REQUEST })
export class TransactionProvider {
  constructor(private readonly clsService: ClsService) {}

  setManager(manager: EntityManager): void {
    this.clsService.set('entityManager', manager);
  }

  getManager(): EntityManager {
    return this.clsService.get('entityManager');
  }
}
