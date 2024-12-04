import { Router } from 'express';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';
var router = Router();
router.get('/', function (req, res) {
    var accounts = db.prepare('SELECT * FROM service_accounts').all();
    res.json(accounts);
});
router.post('/', function (req, res) {
    var _a = req.body, name = _a.name, type = _a.type, credentials = _a.credentials, logo = _a.logo, maxDevices = _a.maxDevices;
    var now = new Date().toISOString();
    var account = {
        id: generateId(),
        name: name,
        type: type,
        credentials: JSON.stringify(credentials),
        logo: logo,
        maxDevices: maxDevices,
        createdAt: now,
        updatedAt: now,
    };
    db.prepare("\n    INSERT INTO service_accounts (id, name, type, credentials, logo, maxDevices, createdAt, updatedAt)\n    VALUES (@id, @name, @type, @credentials, @logo, @maxDevices, @createdAt, @updatedAt)\n  ").run(account);
    res.status(201).json(account);
});
export { router as accountsRouter };
