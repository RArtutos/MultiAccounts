import { Router } from 'express';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';
var router = Router();
router.get('/', function (req, res) {
    var subscriptions = db.prepare('SELECT * FROM subscriptions').all();
    res.json(subscriptions);
});
router.post('/', function (req, res) {
    var _a = req.body, userId = _a.userId, serviceAccountId = _a.serviceAccountId, startDate = _a.startDate, endDate = _a.endDate;
    var now = new Date().toISOString();
    var subscription = {
        id: generateId(),
        userId: userId,
        serviceAccountId: serviceAccountId,
        startDate: startDate,
        endDate: endDate,
        status: 'active',
        createdAt: now,
        updatedAt: now,
    };
    db.prepare("\n    INSERT INTO subscriptions (id, userId, serviceAccountId, startDate, endDate, status, createdAt, updatedAt)\n    VALUES (@id, @userId, @serviceAccountId, @startDate, @endDate, @status, @createdAt, @updatedAt)\n  ").run(subscription);
    res.status(201).json(subscription);
});
export { router as subscriptionsRouter };
