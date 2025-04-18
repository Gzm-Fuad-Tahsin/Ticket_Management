import { JwtPayload } from 'jsonwebtoken';
import { info } from '../modules/StorageSytem/storageSystem.interface';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
      info:info;
    }
  }
}
