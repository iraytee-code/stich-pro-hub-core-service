import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Response } from 'express';

export type TResponse<T> = {
  status: number;
  success: boolean;
  message: string;
  data: T;
  duration: number;
};

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, TResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TResponse<T>> {
    const startTime = Date.now(); // Start time
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context, startTime)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context, startTime)),
      ),
    );
  }

  // success response handler
  responseHandler(
    res: any,
    context: ExecutionContext,
    startTime: number,
  ): TResponse<T> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const status = response.status;

    return {
      status,
      success: true,
      message: 'Request successful',
      data: res,
      duration: Date.now() - startTime,
    };
  }

  // error response handler
  errorHandler(
    exception: any,
    context: ExecutionContext,
    startTime: number,
  ): any {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    const message = exception?.getResponse
      ? exception?.getResponse().message
      : exception.message;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof BadRequestException) {
      if (typeof message === 'object') {
        const responseMsr = message.map((data: any) => {
          const issues = {
            field: '',
            errors: [],
          };
          if (data?.constraints) {
            issues.field = data.property;
            for (const key of Object.keys(data.constraints)) {
              issues.errors.push(data.constraints[key]);
            }
          }
          if (data?.children) {
            data.children.forEach((element) => {
              issues.field = `${data.property}.${element.property}`;
              for (const key of Object.keys(element.constraints)) {
                issues.errors.push(element.constraints[key]);
              }
            });
          }
          return issues;
        });

        return response.status(status).json({
          status: status,
          success: false,
          message: 'Bad Request',
          errors: responseMsr,
          duration: Date.now() - startTime,
        });
      }
    }

    response.status(status).json({
      status: status,
      success: false,
      message: message ?? 'Request failed',
      duration: Date.now() - startTime,
    });
  }
}
