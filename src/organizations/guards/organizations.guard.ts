import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizationsService } from '../organizations.service';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(private organizationService: OrganizationsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const organizationId = request?.params.id;

    if (organizationId) {
      const { id: userId } = request.user;

      const organization =
        await this.organizationService.findById(organizationId);

      if (!organization)
        throw new HttpException(
          'This organization is not valid anymore',
          HttpStatus.NOT_FOUND,
        );

      if (userId == organization.ownerId) {
        return true;
      }
    }

    throw new UnauthorizedException(
      'You are not allowed to do this action, only organization owners can do this!.',
    );
  }
}
