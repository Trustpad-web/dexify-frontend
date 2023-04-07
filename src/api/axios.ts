import axios from 'axios';
import { BACKEND_API } from '../constants';

export const backendInstance = axios.create({
    baseURL: BACKEND_API,
});