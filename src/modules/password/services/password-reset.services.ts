import { OrganizationRepository } from '@adapters/repositories/organization.repository';
import { OtpService } from '@modules/core/services/otp.service';
import { UserService } from '@modules/user/services/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RandomnessUtil } from '@shared/utils/encryption/randomness.util';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly randomnessUtil: RandomnessUtil,
  ) {}

  async initiatePasswordReset(email: string): Promise<void> {
    const organization = await this.organizationRepository.findByEmail(email);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // const owner = await this.userService.findUserByOrganizationId(organization.id);

    await this.otpService.createPasswordResetOtpcode({
      medium: email,
      name: organization.name,
      organizationId: organization.id,
    });
  }

  async verifyOtpAndResetPassword(email: string, otp: string): Promise<void> {
    const organization = await this.organizationRepository.findByEmail(email);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    await this.otpService.verifyPasswordResetOtpCode({
      medium: email,
      pinId: otp,
    });

    const owner = await this.userService.findUserByOrganizationId(organization.id);
    const newPassword = this.randomnessUtil.generateRandomString(12);

    await this.userService.updateUser(owner.id, {
      password: await this.userService['hashingUtil'].hash(newPassword),
      requirePasswordChange: true,
    });

    await this.otpService.sendNewPasswordEmail({
      to: owner.email,
      name: organization.name,
      password: newPassword,
    });
  }
}
