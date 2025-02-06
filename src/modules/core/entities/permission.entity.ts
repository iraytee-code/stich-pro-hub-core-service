import { BaseEntity } from '@shared/repositories/base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

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
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({ type: 'text', nullable: false })
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

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
