import { verifyToken } from '@/lib/auth';
export function authenticate(req, res, next) {
    var _a;
    try {
        var token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            throw new Error('No token provided');
        }
        var user = verifyToken(token);
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}
