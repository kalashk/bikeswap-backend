import { Request as ExpressRequest } from 'express';

interface Request extends ExpressRequest {
    identity?: any;
}
export default Request;
