import { BaseEntity } from '@shared/repositories/base.entity';
import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, Unique } from 'typeorm';
import { User } from './user.entity';

export enum OrganizationStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('organizations')
@Unique(['name'])
export class Organization extends BaseEntity {
  @Column({ type: 'varchar' })
  @Index()
  name: string;

  @Column({
    type: 'enum',
    enum: OrganizationStatus,
    default: OrganizationStatus.PENDING,
  })
  status: OrganizationStatus;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'owner_id', // Explicitly specify the column name
  })
  ownerId: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    name: 'org_phone_number', // Match the database column name
  })
  orgPhoneNumber: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
    name: 'contact_email', // Match the database column name
  })
  contactEmail: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  state: string;

  @Column({ type: 'varchar' })
  country: string;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_verified', // Match the database column name
  })
  isVerified: boolean;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'owner_id' }) // Match the column name in database
  owner: User;
}
