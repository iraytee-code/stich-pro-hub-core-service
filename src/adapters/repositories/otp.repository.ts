import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { OtpActions, OtpCode } from '@modules/core/entities/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OtpCodeRepository extends Repository<OtpCode> {
  private logger = new Logger(OtpCodeRepository.name);

  constructor(
    @InjectRepository(OtpCode)
    private otpCodeRepository: Repository<OtpCode>,
    private entityManager: EntityManager,
  ) {
    super(otpCodeRepository.target, otpCodeRepository.manager, otpCodeRepository.queryRunner);
  }

  async createOtpCode(otpData: Partial<OtpCode>): Promise<OtpCode> {
    const otpCode = this.create(otpData);
    return await this.save(otpCode);
  }

  async getOtpCodeById(id: FindOneOptions<OtpCode>): Promise<OtpCode | undefined> {
    return await this.findOne(id);
  }

  async updateOtpCode(id: FindOneOptions<OtpCode>, updateData: Partial<OtpCode>): Promise<void> {
    await this.update(id as string, updateData);
  }

  async getAllOtpCodes(): Promise<OtpCode[]> {
    return await this.find();
  }

  async getOtpCodeByMedium(medium: string, action: OtpActions): Promise<OtpCode | undefined> {
    return await this.findOne({ where: { medium, isActive: true, isVerified: false, action } });
  }
}
