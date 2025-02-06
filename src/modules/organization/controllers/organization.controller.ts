import { Broker } from '@broker/broker';
import { Body, Controller, HttpCode, HttpStatus, Logger, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrganizationSignupUsecase } from '../usecase/organizationSignup.usecase';
import { OrganizationSignupDto } from '../dtos/organizationSignup.dto';
import { CustomFieldValidationPipe } from '@shared/validations/custom.validation';
import { VerifyOrganizationDto } from '../dtos/verifyOrganization.dto';
import { VerifyOrganizationAccountUsecase } from '../usecase/verifyOrganization.usecase';
import { Public } from '@shared/decorators/isPublic.decorator';

@ApiTags('Onboarding')
@Controller('organization/')
export class OrganizationController {
  private readonly logger = new Logger(OrganizationController.name);

  constructor(
    private readonly serviceBroker: Broker,
    private readonly organizationSignupUsecase: OrganizationSignupUsecase,
    private readonly verifyOrganizationAccountUsecase: VerifyOrganizationAccountUsecase,
  ) {}

  @Public()
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'signup', summary: 'Signup' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Signup successful.' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Signup successful.' })
  signup(@Body(CustomFieldValidationPipe) signUpDto: OrganizationSignupDto) {
    return this.serviceBroker.runUsecases([this.organizationSignupUsecase], signUpDto);
  }

  @Public()
  @Public()
  @Patch('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'verifyAccount', summary: 'verify account' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Account successfully verified.' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Account successfully verified.' })
  verify(@Body(CustomFieldValidationPipe) verifyAccountDto: VerifyOrganizationDto) {
    return this.serviceBroker.runUsecases(
      [this.verifyOrganizationAccountUsecase],
      verifyAccountDto,
    );
  }
}
