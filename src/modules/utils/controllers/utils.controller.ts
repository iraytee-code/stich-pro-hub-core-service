import { Broker } from '@broker/broker';
import { FetchPermissionUsecase } from '@modules/core/usecases/fetchPermissions.usecase';
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
  ) {}

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
}
