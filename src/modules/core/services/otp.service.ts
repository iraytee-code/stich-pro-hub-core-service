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
        },
      });
    } catch (error) {
      this.logger.error(`Failed to send default password email to ${to}`, error);
      throw new BadRequestException('Failed to send default password email');
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
}
