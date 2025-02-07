import { Broker } from '@broker/broker';
import { FetchPermissionUsecase } from '@modules/core/usecases/fetchPermissions.usecase';
import { FetchRolesUsecase } from '@modules/core/usecases/fetchRoles.usecase';
import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '@shared/decorators/isPublic.decorator';

@ApiTags('Utils')
@Controller('utils')
export class UtilsController {
  private readonly logger = new Logger(UtilsController.name);

  constructor(
    private readonly broker: Broker,
    private readonly permissionsUsecase: FetchPermissionUsecase,
    private readonly rolesUsecase: FetchRolesUsecase,
  ) {}

  // permissions utilities
  @Public()
  @Get('permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'fetchPermissions', summary: 'Fetch all permissions' })
  @ApiOkResponse({ status: HttpStatus.OK })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR })
  fetchPermissions() {
    this.logger.log('Fetching permissions');
    return this.broker.runUsecases([this.permissionsUsecase]);
  }

  // roles utilities
  @Public()
  @Get('roles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'fetchRoles', summary: 'Fetch all roles' })
  @ApiOkResponse({ status: HttpStatus.OK })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR })
  fetchRoles() {
    this.logger.log('Fetching roles');
    return this.broker.runUsecases([this.rolesUsecase]);
  }
}
