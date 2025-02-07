import { User } from '@modules/core/entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository.target, userRepository.manager, userRepository.queryRunner);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.create(userData);
    return await this.save(user);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.findOne({
      where: { email },
    });
  }

  async getUserById(id: string): Promise<User | undefined> {
    return await this.findOne({
      where: { id },
    });
  }

  async getUserByData(
    userData: Partial<Pick<User, 'id' | 'email' | 'organizationId'>>,
  ): Promise<User | undefined> {
    return await this.findOne({
      where: [
        { id: userData.id },
        { email: userData.email },
        { organizationId: userData.organizationId },
      ],
    });
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | undefined> {
    await this.update(id, updateData);
    return this.getUserById(id);
  }

  async findOrganizationUsers(organizationId: string): Promise<User[]> {
    return await this.find({
      where: { organizationId },
      //   relations: ['role'], // Include role relation if needed
    });
  }

  async findOrganizationOwner(organizationId: string): Promise<User | undefined> {
    return await this.findOne({
      where: {
        organizationId,
        ownedOrganization: { id: organizationId },
      },
      relations: ['ownedOrganization'],
    });
  }

  async findOne(options: FindOneOptions<User>): Promise<User | null> {
    return this.createQueryBuilder('user').where(options.where).getOne();
  }
}
