import { Injectable, Logger } from '@nestjs/common';
import { IEmail, SendEmailDto } from './email.interface';
import { ConfigService } from '@nestjs/config';
import { SendgridProvider } from './providers/sendgrid.provider';

enum EmailProvider {
  SENDGRID = 'sendgrid',
  MAILGUN = 'mailgun',
}

@Injectable()
export class EmailAdapter implements IEmail {
  private Logger = new Logger(EmailAdapter.name);
  private EmailProvider: IEmail;

  constructor(
    private readonly configService: ConfigService,
    private sendgridProvider: SendgridProvider,
  ) {}

  public async send(sendEmailDto: SendEmailDto): Promise<void> {
    await this.initializeProvider(
      this.configService.get<string>('common.defaultEmailProvider') as EmailProvider,
    );
    this.EmailProvider.send(sendEmailDto);
  }

  private async initializeProvider(emailProvider) {
    switch (emailProvider) {
      case EmailProvider.SENDGRID:
        this.EmailProvider = this.sendgridProvider;
        break;
      default:
        throw new Error('❌ The selected email provider is not supported.');
    }
  }
}
