import { Router } from 'express';
import { db } from '@/lib/db';
var router = Router();
router.get('/', function (req, res) {
    var stats = {
        totalUsers: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
        activeDevices: db.prepare('SELECT COUNT(*) as count FROM devices').get().count,
        activeSubscriptions: db.prepare('SELECT COUNT(*) as count FROM subscriptions WHERE status = ?').get('active').count,
    };
    res.json(stats);
});
export { router as statsRouter };
