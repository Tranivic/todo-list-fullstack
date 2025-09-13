import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../../tasks/dto/responses/api-response.dto';

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, ApiResponseDto<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponseDto<T>> {
        const request = context.switchToHttp().getRequest();

        return next.handle().pipe(
            map((data) => {
                if (data instanceof ApiResponseDto) {
                    data.path = request.url;
                    return data;
                }
                return new ApiResponseDto(
                    true,
                    'Success',
                    data,
                    undefined,
                    request.url,
                );
            }),
        );
    }
}
