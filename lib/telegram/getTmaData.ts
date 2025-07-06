import { parse, validate } from '@telegram-apps/init-data-node';
import { InitData } from '@telegram-apps/init-data-node';

export async function getTmaData(
  headers: Headers,
): Promise<InitData | null> {
  const headerValue = headers.get('authorization') || '';
  const parts = headerValue.split(' ');
  const authData = parts.length > 1 ? parts[1] : '';

  let authDataObject: InitData | null = null;

  
  try {
    if (process.env.NODE_ENV === 'production') {
      validate(authData, process.env.TELEGRAM_BOT_TOKEN!)
    }
    authDataObject = parse(authData);
  } catch (err) {
    console.error('Failed to validate or parse auth data', err);
  }

  return authDataObject;
}