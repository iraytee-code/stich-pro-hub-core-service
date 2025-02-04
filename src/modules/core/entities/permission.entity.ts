import { BaseEntity } from '@shared/repositories/base.entity';
import { Column, Entity } from 'typeorm';

export enum PermissionScope {
  SYSTEM = 'SYSTEM',
  ORGANIZATION = 'ORGANIZATION',
}

export enum PermissionCategory {
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  CLIENT_MANAGEMENT = 'CLIENT_MANAGEMENT',
}

export enum PermissionStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PermissionScope,
    default: PermissionScope.SYSTEM,
  })
  scope: PermissionScope;

  @Column({
    type: 'enum',
    enum: PermissionCategory,
  })
  category: PermissionCategory;

  @Column({
    type: 'enum',
    enum: PermissionStatus,
    default: PermissionStatus.ENABLED,
  })
  status: PermissionStatus;
}
