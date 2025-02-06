import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEmail, SendEmailDto } from '../email.interface';
import { MailService } from '@sendgrid/mail';

@Injectable()
export class SendgridProvider implements IEmail {
  private readonly sendGrid: MailService;
  private logger: Logger;

  constructor(private readonly configService: ConfigService) {
    this.logger = new Logger(SendgridProvider.name);
    this.sendGrid = new MailService();
    this.sendGrid.setApiKey(configService.getOrThrow('common.sendgrid.apiKey'));
  }

  async send(sendEmailDto: SendEmailDto): Promise<void> {
    try {
      await this.sendGrid.send(sendEmailDto);
      this.logger.log(`✅ Email successfully dispatched to ${sendEmailDto.to as string}`);
    } catch (error) {
      this.logger.error('❌ Failed to dispatch email, error message: ', error);
      throw error;
    }
  }
}
