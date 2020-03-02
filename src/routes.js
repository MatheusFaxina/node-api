import { Router } from 'express';

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";
import ProviderController from "./app/controllers/ProviderController";

import AuthMiddleware from "./app/middlewares/AuthMiddleware";

import multer from 'multer';
import multerConfig from './config/multer';
import AgendamentoController from "./app/controllers/AgendamentoController";

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(AuthMiddleware);
routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index)

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/agendamento', AgendamentoController.store);

export default routes;
