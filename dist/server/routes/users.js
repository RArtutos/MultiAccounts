import { Router } from 'express';
import { db } from '@/lib/db';
var router = Router();
router.get('/', function (req, res) {
    var users = db.prepare('SELECT id, email, name, role, createdAt, updatedAt FROM users').all();
    res.json(users);
});
export { router as usersRouter };
