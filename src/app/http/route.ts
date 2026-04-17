import { emailWebhook } from '@/app/http/controllers/webhook/email-webhook';
import { Router } from 'express';

export const route: Router = Router();

route.post('/webhook/email', (req, res) => emailWebhook(req, res));
