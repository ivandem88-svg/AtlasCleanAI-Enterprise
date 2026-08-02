import bcrypt from 'bcryptjs';

import { config } from '../../config';

export const hashValue = async (value: string): Promise<string> => bcrypt.hash(value, config.security.bcryptRounds);

export const compareHash = async (value: string, hash: string): Promise<boolean> => bcrypt.compare(value, hash);
