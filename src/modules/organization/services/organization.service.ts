import { OrganizationRepository } from '@adapters/repositories/organization.repository';
import { UserService } from '@modules/user/services/user.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Organization } from '@modules/core/entities/organization.entity';
import { FindOneOptions } from 'typeorm';
import { OrganizationSignupDto } from '../dtos/organizationSignup.dto';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly userService: UserService,
  ) {}

  async createOrganization(organizationData: OrganizationSignupDto): Promise<Organization> {
    await this.findOrganizationAndFailIfExist(organizationData);

    // Create organization first
    const organization = await this.organizationRepository.createOrganization({
      name: organizationData.name,
      orgPhoneNumber: organizationData.orgPhoneNumber,
      contactEmail: organizationData.contactEmail,
      address: organizationData.address,
      city: organizationData.city,
      state: organizationData.state,
      country: organizationData.country,
      isVerified: false,
    });

    // Create owner with reference to organization
    const owner = await this.userService.createOrganizationOwner({
      email: organizationData.ownerEmail,
      firstName: organizationData.ownerFirstName,
      lastName: organizationData.ownerLastName,
      password: organizationData.ownerPassword,
      organizationId: organization.id,
      roleId: null,
    });

    // Update organization with owner reference
    return await this.organizationRepository.updateOrganization(
      organization.id as FindOneOptions<Organization>,
      { ownerId: owner.id },
    );
  }

  async findOrganizationAndFailIfExist(
    organizationData: Partial<
      Pick<Organization, 'id' | 'contactEmail' | 'orgPhoneNumber' | 'name'>
    >,
  ): Promise<void> {
    const organization = await this.organizationRepository.getOrganizationByData(organizationData);
    if (organization) {
      if (organizationData?.id) {
        this.logger.error(`This admin already exists`);
        throw new BadRequestException(`This admin already exists`);
      }
      if (organizationData?.contactEmail || organizationData?.orgPhoneNumber) {
        if (organization?.contactEmail === organizationData?.contactEmail) {
          this.logger.error('This email is already in use');
          throw new BadRequestException('This email is already in use');
        } else {
          this.logger.error('This phone number is already in use');
          throw new BadRequestException('This phone number is already in use');
        }
      }
    }
  }

  async findOrganizationAndFailIfNotExist(
    organizationData: Partial<Pick<Organization, 'id' | 'contactEmail' | 'orgPhoneNumber'>>,
  ): Promise<Organization> {
    const user = await this.organizationRepository.getOrganizationByData(organizationData);
    if (!user) {
      this.logger.error(`Organization not found`);
      throw new BadRequestException(`Organization not found`);
    }

    return user;
  }

  async updateOrganizationByEmail(organizationData: Partial<Organization>): Promise<Organization> {
    const organization = await this.findOrganizationAndFailIfNotExist({
      contactEmail: organizationData.contactEmail,
    });
    const updateUserData = await this.organizationRepository.updateOrganization(
      organization.id as FindOneOptions<Organization>,
      organizationData,
    );

    return updateUserData;
  }
}
