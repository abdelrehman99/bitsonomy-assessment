import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './schemas/organization.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<Organization>,
  ) {}

  async create(user: User, createOrganizationDto: CreateOrganizationDto) {
    const organization = await this.organizationModel.create({
      ...createOrganizationDto,
      ownerId: user.id,
      members: [{ name: user.name, email: user.email, access_level: 'Owner' }],
    });
    return { organization_id: organization.id };
  }

  async findAll() {
    return await this.organizationModel.find();
  }

  async findById(id: string) {
    return await this.organizationModel.findById(id);
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    return await this.organizationModel.findByIdAndUpdate(
      id,
      {
        ...updateOrganizationDto,
      },
      { new: true },
    );
  }

  async remove(id: string) {
    await this.organizationModel.findByIdAndDelete(id);
    return { message: 'This organization is deleted successfully.' };
  }
}
