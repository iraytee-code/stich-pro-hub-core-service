import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly logger = new Logger(AuthorizationGuard.name);

  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // get token from request headers
    const accessKey =
      req?.headers[this.configService.get<string>('common.auth.authName')];

    if (!accessKey) {
      this.logger.error('Forbidden request!');
      throw new ForbiddenException('Request is forbidden', 'ERR_USR_2');
    }

    if (
      accessKey !== this.configService.get<string>('common.auth.serviceKey')
    ) {
      this.logger.error('Request is forbidden');
      throw new ForbiddenException('Request is forbidden', 'ERR_USR_2');
    }

    this.logger.log('✅ Request is authorized for public routes');
    return true;
  }
}
