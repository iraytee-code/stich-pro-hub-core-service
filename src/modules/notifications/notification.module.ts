import { Module } from '@nestjs/common';
import { EmailAdapter } from '@adapters/notifications/email/email.adapter';
import { SendgridProvider } from '@adapters/notifications/email/providers/sendgrid.provider';

@Module({
  providers: [EmailAdapter, SendgridProvider],
  exports: [EmailAdapter, SendgridProvider],
})
export class NotificationModule {}
