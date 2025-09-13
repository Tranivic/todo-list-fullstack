import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Page must be a valid integer' })
    @Min(1, { message: 'Page must be greater than 0' })
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Limit must be a valid integer' })
    @Min(1, { message: 'Limit must be greater than 0' })
    @Max(100, { message: 'Limit cannot exceed 100' })
    limit: number = 10;
}