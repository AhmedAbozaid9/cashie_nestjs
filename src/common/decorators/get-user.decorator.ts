import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { user?: any }>();
    const user = request.user;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return data ? user?.[data] : user;
  },
);
