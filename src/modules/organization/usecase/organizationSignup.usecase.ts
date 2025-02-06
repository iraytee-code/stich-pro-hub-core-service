import { Usecase } from '@broker/types';
import { OtpService } from '@modules/core/services/otp.service';
import { OrganizationService } from '../services/organization.service';
import { Injectable, Logger } from '@nestjs/common';
import { OrganizationSignupDto } from '../dtos/organizationSignup.dto';

export type SignupResponse = {
  email: string;
  destination: string;
};

@Injectable()
export class OrganizationSignupUsecase extends Usecase<SignupResponse> {
  private logger = new Logger(OrganizationSignupUsecase.name);

  constructor(
    private readonly organizationService: OrganizationService,
    private readonly otpService: OtpService,
  ) {
    super();
  }

  async execute(
    transactionalEntityManager,
    organizationSignUpDto: OrganizationSignupDto,
  ): Promise<SignupResponse> {
    const user = await this.organizationService.createOrganization(organizationSignUpDto);
    await this.otpService.createAccountVerificationOtpCode({
      medium: user.contactEmail,
      organizationId: user.id,
      name: user.name,
    });
    return { email: user.contactEmail, destination: 'verify email' };
  }
}
