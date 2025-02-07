import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Usecase } from './types';

{
  /*
    - This Broker class is like a coordinator that manages a series of tasks (called "usecases")
    - Takes a list of jobs to do
    - Does them all in the right order
    - Makes sure they either all succeed or all fail together
    - Keeps track of everything that happens
    - Returns the final results
   */
}

@Injectable()
export class Broker {
  private readonly logger = new Logger(Broker.name);

  constructor(@InjectEntityManager() private readonly entityManager: EntityManager) {}

  async runUsecases(usecases: Usecase[], initialArguments: Record<string, any> = {}): Promise<any> {
    return this.entityManager.transaction(async (transactionalEntityManager) => {
      this.logger.debug(`Running ${usecases.length} usecases`);
      this.logger.debug(`Initial args: ${JSON.stringify(initialArguments)}`);

      let results = { ...initialArguments };

      for (const useCase of usecases) {
        this.logger.debug(`Running usecase: ${useCase.constructor.name}`);
        const result = await useCase.execute(transactionalEntityManager, results);
        results = { ...results, ...result };
      }

      //Remove initial args from results
      for (const key in initialArguments) {
        if (Object.keys(results).includes(key) || key === 'password') {
          delete results[key];
        }
      }

      this.logger.debug(`Final results: ${JSON.stringify(results)}`);
      return results;
    });
  }
}
