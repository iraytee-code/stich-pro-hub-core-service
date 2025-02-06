import {
  BaseEntity as TypeOrmBaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IsDateString, IsOptional } from 'class-validator';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @CreateDateColumn({
    name: 'created_at', // Explicitly define column name
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at', // Explicitly define column name
    type: 'timestamp with time zone',
  })
  @DeleteDateColumn({
    name: 'deleted_at', // Explicitly define column name
    type: 'timestamp with time zone',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  @DeleteDateColumn()
  deletedAt?: Date;
}
