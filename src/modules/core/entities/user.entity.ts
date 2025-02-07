import { BaseEntity } from '@shared/repositories/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { Role } from './role.entity';

export enum UserType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ORGANIZATION_ADMIN = 'ORGANIZATION_ADMIN',
  ORGANIZATION_USER = 'ORGANIZATION_USER',
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('users')
@Index(['email', 'organizationId'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', unique: true, name: 'email' })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId: string | null;

  @Column({ type: 'varchar' })
  roleId: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.ORGANIZATION_USER,
  })
  type: UserType;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column({
    type: 'boolean',
    default: true,
    name: 'require_password_change',
  })
  requirePasswordChange: boolean;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToOne(() => Organization, (org) => org.owner)
  ownedOrganization: Organization;

  @ManyToOne(() => Organization, (org) => org.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
