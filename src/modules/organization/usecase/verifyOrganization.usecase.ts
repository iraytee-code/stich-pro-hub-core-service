import { Injectable, Logger } from '@nestjs/common';
import { Usecase } from '@broker/types';
import { VerifyOrganizationDto } from '../dtos/verifyOrganization.dto';
import { OtpService } from '@modules/core/services/otp.service';
import { OrganizationService } from '../services/organization.service';
import { UserService } from '@modules/user/services/user.service';
import { RandomnessUtil } from '@shared/utils/encryption/randomness.util';
import { HashingUtil } from '@shared/utils/hashing/hashing.utils';

export type VerifyAccountResponse = {
  message: string;
  destination: string;
};

@Injectable()
export class VerifyOrganizationAccountUsecase extends Usecase<VerifyAccountResponse> {
  private readonly logger = new Logger(VerifyOrganizationAccountUsecase.name);

  constructor(
    private readonly otpService: OtpService,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly randomnessUtil: RandomnessUtil,
    private readonly hashingUtil: HashingUtil,
  ) {
    super();
  }

  async execute(
    transactionalEntityManager,
    verifyAccountDto: VerifyOrganizationDto,
  ): Promise<VerifyAccountResponse> {
    try {
      // Verify the OTP
      await this.otpService.confirmAccountVerificationOtpCode({
        medium: verifyAccountDto.email,
        pinId: verifyAccountDto.otp,
      });

      // Get organization details first
      const organization = await this.organizationService.updateOrganizationByEmail({
        contactEmail: verifyAccountDto.email,
        isVerified: true,
      });

      // Get user by organization ID instead of email
      const user = await this.userService.findUserByOrganizationId(organization.id);
      if (!user) {
        throw new Error('Organization owner not found');
      }

      // Generate and hash default password
      const defaultPassword = this.randomnessUtil.generateRandomString(12);
      const hashedPassword = await this.hashingUtil.hash(defaultPassword);

      // Update user with default password
      await this.userService.updateUser(user.id, {
        password: hashedPassword,
      });

      // Send default password email
      await this.otpService.sendOrganizationDefaultPassword(
        user.email,
        user.firstName,
        defaultPassword,
      );

      return {
        message:
          'Organization Account verified successfully. Please check your email for login credentials.',
        destination: 'signin',
      };
    } catch (error) {
      this.logger.error('Error during organization verification:', error);
      throw error;
    }
  }
}
