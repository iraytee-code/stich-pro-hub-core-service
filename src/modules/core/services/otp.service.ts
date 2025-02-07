import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindOneOptions } from 'typeorm';
import { addMinutes, differenceInMinutes } from 'date-fns';
import { OtpCodeRepository } from '@adapters/repositories/otp.repository';
import { EmailAdapter } from '@adapters/notifications/email/email.adapter';
import { RandomnessUtil } from '@shared/utils/encryption/randomness.util';
import { OtpActions, OtpCode } from '../entities/otp.entity';

interface CreateAccountVerificationOtpCodeDto {
  organizationId: string;
  medium: string;
  name: string;
}

interface SendPasswordEmailParams {
  to: string;
  name: string;
  password: string;
}

interface VerifyOtpCodeDto {
  medium: string;
  pinId: string;
}

interface SendEmailParams {
  to: string;
  name: string;
  otpCode: string;
  expiryTime: number;
}

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly emailVerificationValidityMinutes: number;
  private readonly senderName: string;
  private readonly senderEmail: string;
  private readonly emailVerificationTemplateId: string;

  constructor(
    private readonly randomnessUtil: RandomnessUtil,
    private readonly otpRepository: OtpCodeRepository,
    private readonly configService: ConfigService,
    private readonly emailAdapter: EmailAdapter,
  ) {
    // Initialize configuration values
    this.emailVerificationValidityMinutes = this.configService.get<number>(
      'common.emailVerificationOtpValidityInMinutes',
    );
    this.senderName = this.configService.get<string>('common.sendgrid.senderName');
    this.senderEmail = this.configService.get<string>('common.sendgrid.senderEmail');
    this.emailVerificationTemplateId = this.configService.get<string>(
      'common.sendgrid.templates.emailVerification',
    );
  }

  private generateOtpCode(length: number = 6): string {
    return this.randomnessUtil.generateRandomNumberString(length);
  }

  private async sendVerificationEmail({
    to,
    name,
    otpCode,
    expiryTime,
  }: SendEmailParams): Promise<void> {
    try {
      await this.emailAdapter.send({
        to,
        from: {
          name: this.senderName,
          email: this.senderEmail,
        },
        templateId: this.emailVerificationTemplateId,
        dynamicTemplateData: {
          name,
          otp: otpCode,
          expiryTime,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${to}`, error);
      throw new BadRequestException('Failed to send verification email');
    }
  }

  async createAccountVerificationOtpCode(data: CreateAccountVerificationOtpCodeDto): Promise<void> {
    const otpCode = this.generateOtpCode();

    try {
      // Create OTP record
      await this.otpRepository.createOtpCode({
        ...data,
        pinId: otpCode,
        action: OtpActions.VERIFY_EMAIL,
        expiresAt: addMinutes(new Date(), this.emailVerificationValidityMinutes).toISOString(),
      });

      // Send verification email
      await this.sendVerificationEmail({
        to: data.medium,
        name: data.name,
        otpCode,
        expiryTime: this.emailVerificationValidityMinutes,
      });
    } catch (error) {
      this.logger.error('Failed to create verification OTP', error);
      throw new BadRequestException('Failed to create verification OTP');
    }
  }

  async confirmAccountVerificationOtpCode(data: VerifyOtpCodeDto): Promise<void> {
    const otpDetails = await this.otpRepository.getOtpCodeByMedium(
      data.medium,
      OtpActions.VERIFY_EMAIL,
    );

    if (!otpDetails) {
      throw new BadRequestException('Invalid Request');
    }

    if (otpDetails.pinId !== data.pinId) {
      throw new BadRequestException('Invalid OTP');
    }

    const minutesDifference = differenceInMinutes(new Date(), otpDetails.expiresAt);
    if (minutesDifference > this.emailVerificationValidityMinutes) {
      throw new BadRequestException('OTP Expired');
    }

    await this.otpRepository.updateOtpCode(otpDetails.id as FindOneOptions<OtpCode>, {
      isVerified: true,
      isActive: false,
    });
  }

  private async sendDefaultPasswordEmail({
    to,
    name,
    password,
  }: SendPasswordEmailParams): Promise<void> {
    try {
      await this.emailAdapter.send({
        to,
        from: {
          name: this.senderName,
          email: this.senderEmail,
        },
        templateId: this.configService.get<string>('common.sendgrid.templates.welcome'),
        dynamicTemplateData: {
          name,
          password,
          isTemporary: true, // Add this to the template
          passwordChangeRequired: true, // Add this to the template
        },
      });
    } catch (error) {
      this.logger.error(`Failed to send temporary password email to ${to}`, error);
      throw new BadRequestException('Failed to send temporary password email');
    }
  }

  async sendOrganizationDefaultPassword(
    email: string,
    name: string,
    password: string,
  ): Promise<void> {
    await this.sendDefaultPasswordEmail({
      to: email,
      name,
      password,
    });
  }

  async createPasswordResetOtpcode(data: {
    medium: string;
    name: string;
    organizationId: string;
  }): Promise<void> {
    const otpCode = this.generateOtpCode();

    try {
      await this.otpRepository.createOtpCode({
        ...data,
        pinId: otpCode,
        action: OtpActions.PASSWORD_RESET,
        expiresAt: addMinutes(new Date(), this.emailVerificationValidityMinutes).toISOString(),
      });
      await this.emailAdapter.send({
        to: data.medium,
        from: {
          name: this.senderName,
          email: this.senderEmail,
        },
        templateId: this.configService.get<string>('common.sendgrid.templates.passwordResetOtp'),
        dynamicTemplateData: {
          name: data.name,
          otp: otpCode,
          expiryTime: this.emailVerificationValidityMinutes,
        },
      });
    } catch (error) {
      this.logger.error('Failed to create password reset OTP', error);
      throw new BadRequestException('Failed to create password reset OTP');
    }
  }

  async sendNewPasswordEmail(data: { to: string; name: string; password: string }): Promise<void> {
    try {
      await this.emailAdapter.send({
        to: data.to,
        from: {
          name: this.senderName,
          email: this.senderEmail,
        },
        templateId: this.configService.get<string>('common.sendgrid.templates.passwordReset'),
        dynamicTemplateData: {
          name: data.name,
          password: data.password,
          isTemporary: true,
          passwordChangeRequired: true,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to send new password email to ${data.to}`, error);
      throw new BadRequestException('Failed to send new password email');
    }
  }

  async verifyPasswordResetOtpCode(data: { medium: string; pinId: string }): Promise<void> {
    const otpDetails = await this.otpRepository.getOtpCodeByMedium(
      data.medium,
      OtpActions.PASSWORD_RESET,
    );

    if (!otpDetails) {
      throw new BadRequestException('Invalid Request');
    }

    if (otpDetails.pinId !== data.pinId) {
      throw new BadRequestException('Invalid OTP');
    }

    const minutesDifference = differenceInMinutes(new Date(), otpDetails.expiresAt);
    if (minutesDifference > this.emailVerificationValidityMinutes) {
      throw new BadRequestException('OTP Expired');
    }

    await this.otpRepository.updateOtpCode(otpDetails.id as FindOneOptions<OtpCode>, {
      isVerified: true,
      isActive: false,
    });
  }
}
