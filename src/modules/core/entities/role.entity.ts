import { BaseEntity } from '@shared/repositories/base.entity';
import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './permission.entity';

export enum RoleScope {
  SYSTEM = 'SYSTEM',
  ORGANIZATION = 'ORGANIZATION',
}

export enum RoleStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: RoleScope, default: RoleScope.SYSTEM })
  scope: RoleScope;

  @Column({ type: 'enum', enum: RoleStatus, default: RoleStatus.ENABLED })
  status: RoleStatus;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  roles: Role[];
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permissionId',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];
}
