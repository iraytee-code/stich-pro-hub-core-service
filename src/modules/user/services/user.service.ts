import { UserRepository } from '@adapters/repositories/user.repository';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HashingUtil } from '@shared/utils/hashing/hashing.utils';
import { UserType, UserStatus } from '@modules/core/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { User } from '@modules/core/entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingUtil: HashingUtil,
  ) {}

  async createOrganizationOwner(data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    organizationId: string;
    roleId: string;
  }): Promise<User> {
    const existingUser = await this.userRepository.getUserByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await this.hashingUtil.hash(data?.password);

    return await this.userRepository.createUser({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: hashedPassword,
      organizationId: data.organizationId,
      roleId: data.roleId,
      type: UserType.ORGANIZATION_ADMIN,
      status: UserStatus.PENDING,
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userRepository.updateUser(id, updateData);
  }

  async findUserByOrganizationId(organizationId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        organizationId,
        type: UserType.ORGANIZATION_ADMIN,
      },
    });

    if (!user) {
      throw new NotFoundException('Organization owner not found');
    }
    return user;
  }
}
