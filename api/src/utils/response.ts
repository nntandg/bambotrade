import { Response } from 'express';

export class ApiResponse {
    static success(
        res: Response,
        data?: any,
        message?: string,
        statusCode: number = 200
    ) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static error(
        res: Response,
        error: string,
        statusCode: number = 400,
        details?: any
    ) {
        return res.status(statusCode).json({
            success: false,
            error,
            details
        });
    }

    static paginated(
        res: Response,
        data: any[],
        pagination: any,
        message?: string
    ) {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination
        });
    }
}