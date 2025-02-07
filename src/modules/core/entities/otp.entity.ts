import { Column, Entity, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { BaseEntity } from '@shared/repositories/base.entity';

export enum OtpActions {
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

@Entity('otp_codes')
export class OtpCode extends BaseEntity {
  @ManyToOne(() => Organization)
  organization: Organization;

  @Column({ type: 'uuid', nullable: false })
  organizationId: string;

  @Column({ type: 'varchar', nullable: false })
  pinId: string;

  @Column({ type: 'varchar', nullable: false })
  medium: string;

  @Column({ type: 'enum', enum: OtpActions, nullable: false })
  action: OtpActions;

  @Column({ type: 'timestamp', nullable: false })
  expiresAt: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
