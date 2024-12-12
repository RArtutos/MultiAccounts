import express from 'express';
import { config } from './src/config/index.js';
import routes from './src/routes/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Mount routes
app.use('/', routes);

// Add root redirect to dashboard
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
  console.log(`Dashboard: http://localhost:${config.port}/dashboard`);
  console.log(`Admin panel: http://localhost:${config.port}/admin (user: admin, pass: secret)`);
});