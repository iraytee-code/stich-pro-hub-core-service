import { Organization } from '@modules/core/entities/organization.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class OrganizationRepository extends Repository<Organization> {
  private readonly logger = new Logger(OrganizationRepository.name);

  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {
    super(
      organizationRepository.target,
      organizationRepository.manager,
      organizationRepository.queryRunner,
    );
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return await this.find();
  }

  async createOrganization(organizationData: Partial<Organization>): Promise<Organization> {
    const organization = this.create(organizationData);
    return await this.save(organization);
  }

  async getOrganizationByData(
    organizationData: Partial<Pick<Organization, 'id' | 'contactEmail' | 'orgPhoneNumber'>>,
  ): Promise<Organization> {
    return this.findOne({
      where: [
        { contactEmail: organizationData.contactEmail },
        { orgPhoneNumber: organizationData.orgPhoneNumber },
        { id: organizationData?.id },
      ],
    });
  }

  async getOrganizationById(id: FindOneOptions<Organization>): Promise<Organization | undefined> {
    return await this.findOne({ where: { id: id as string } });
  }

  async updateOrganization(
    id: FindOneOptions<Organization>,
    updateData: Partial<Organization>,
  ): Promise<Organization | undefined> {
    await this.update(id as string, updateData);
    return this.getOrganizationById(id);
  }

  async findByEmail(email: string): Promise<Organization | undefined> {
    return this.organizationRepository.findOne({ where: { contactEmail: email } });
  }
}
