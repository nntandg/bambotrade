import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '../utils/logger';

export const validateRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);

        if (error) {
            logger.error('Validation error:', error.details);
            return res.status(400).json({
                error: 'Validation error',
                details: error.details.map(detail => detail.message)
            });
        }

        next();
    };
};