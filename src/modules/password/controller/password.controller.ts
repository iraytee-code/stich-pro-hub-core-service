// controllers/password-reset.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@shared/decorators/isPublic.decorator';
import { PasswordResetService } from '../services/password-reset.services';
import { InitiatePasswordResetDto } from '../dtos/initiate-password-reset.dto';
import { VerifyPasswordResetOtpDto } from '../dtos/verify-password-reset.dto';

@ApiTags('Password Reset')
@Controller('password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Public()
  @Post('initiate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate password reset' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password reset initiated successfully' })
  async initiatePasswordReset(@Body() dto: InitiatePasswordResetDto): Promise<void> {
    await this.passwordResetService.initiatePasswordReset(dto.email);
  }

  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and reset password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password reset successful' })
  async verifyOtpAndResetPassword(@Body() dto: VerifyPasswordResetOtpDto): Promise<void> {
    await this.passwordResetService.verifyOtpAndResetPassword(dto.email, dto.otp);
  }
}
