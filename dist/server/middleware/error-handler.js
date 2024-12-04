import { ZodError } from 'zod';
export function errorHandler(error, req, res, next) {
    console.error(error);
    if (error instanceof ZodError) {
        return res.status(400).json({
            message: 'Validation error',
            errors: error.errors,
        });
    }
    res.status(500).json({
        message: 'Internal server error',
    });
}
