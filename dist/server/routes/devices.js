import { Router } from 'express';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';
var router = Router();
router.get('/', function (req, res) {
    var devices = db.prepare('SELECT * FROM devices').all();
    res.json(devices);
});
router.post('/', function (req, res) {
    var _a = req.body, userId = _a.userId, serviceAccountId = _a.serviceAccountId, name = _a.name;
    var now = new Date().toISOString();
    var device = {
        id: generateId(),
        userId: userId,
        serviceAccountId: serviceAccountId,
        name: name,
        lastAccess: now,
        createdAt: now,
        updatedAt: now,
    };
    db.prepare("\n    INSERT INTO devices (id, userId, serviceAccountId, name, lastAccess, createdAt, updatedAt)\n    VALUES (@id, @userId, @serviceAccountId, @name, @lastAccess, @createdAt, @updatedAt)\n  ").run(device);
    res.status(201).json(device);
});
export { router as devicesRouter };
