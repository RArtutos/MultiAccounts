var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { accountsRouter } from './routes/accounts';
import { subscriptionsRouter } from './routes/subscriptions';
import { devicesRouter } from './routes/devices';
import { logsRouter } from './routes/logs';
import { statsRouter } from './routes/stats';
import { errorHandler } from './middleware/error-handler';
import { authenticate } from './middleware/authenticate';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { generateId } from '@/lib/utils';
var app = express();
app.use(cors());
app.use(json());
// Create default admin user if it doesn't exist
var createDefaultAdmin = function () { return __awaiter(void 0, void 0, void 0, function () {
    var adminEmail, existingAdmin, now, hashedPassword, admin;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                adminEmail = 'admin@example.com';
                existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);
                if (!!existingAdmin) return [3 /*break*/, 2];
                now = new Date().toISOString();
                return [4 /*yield*/, hashPassword('admin123')];
            case 1:
                hashedPassword = _a.sent();
                admin = {
                    id: generateId(),
                    email: adminEmail,
                    password: hashedPassword,
                    name: 'Admin User',
                    role: 'admin',
                    createdAt: now,
                    updatedAt: now,
                };
                db.prepare("\n      INSERT INTO users (id, email, password, name, role, createdAt, updatedAt)\n      VALUES (@id, @email, @password, @name, @role, @createdAt, @updatedAt)\n    ").run(admin);
                console.log('Default admin user created');
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
// Initialize admin user
createDefaultAdmin().catch(console.error);
// Public routes
app.use('/api/auth', authRouter);
// Protected routes
app.use('/api/users', authenticate, usersRouter);
app.use('/api/service-accounts', authenticate, accountsRouter);
app.use('/api/subscriptions', authenticate, subscriptionsRouter);
app.use('/api/devices', authenticate, devicesRouter);
app.use('/api/activity-logs', authenticate, logsRouter);
app.use('/api/stats', authenticate, statsRouter);
app.use(errorHandler);
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
