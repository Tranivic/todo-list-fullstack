import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHealthCheck() {
        return {
            status: 'ok',
            message: 'Todo API is running',
            timestamp: new Date().toISOString(),
            service: 'todo-api',
            version: '1.0.0',
            uptime: process.uptime(),
        };
    }
}