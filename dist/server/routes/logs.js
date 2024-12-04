import { Router } from 'express';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';
var router = Router();
router.get('/', function (req, res) {
    var logs = db.prepare('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 100').all();
    res.json(logs);
});
router.post('/', function (req, res) {
    var _a = req.body, userId = _a.userId, serviceAccountId = _a.serviceAccountId, deviceId = _a.deviceId, action = _a.action, details = _a.details;
    var log = {
        id: generateId(),
        userId: userId,
        serviceAccountId: serviceAccountId,
        deviceId: deviceId,
        action: action,
        details: JSON.stringify(details),
        timestamp: new Date().toISOString(),
    };
    db.prepare("\n    INSERT INTO activity_logs (id, userId, serviceAccountId, deviceId, action, details, timestamp)\n    VALUES (@id, @userId, @serviceAccountId, @deviceId, @action, @details, @timestamp)\n  ").run(log);
    res.status(201).json(log);
});
export { router as logsRouter };
