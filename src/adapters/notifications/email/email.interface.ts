type From = {
  name: string;
  email: string;
};

export type SendEmailDto = {
  to: string;
  from: From;
  subject?: string;
  templateId: string;
  dynamicTemplateData: { [key: string]: any };
};

export interface IEmail {
  send(sendEmail: SendEmailDto): Promise<void>;
}
