import { en } from './en';
import { hi } from './hi';
import { Language } from '../types';

export const i18n = { en, hi };

export function translate(lang: Language, key: keyof typeof en): string {
  return i18n[lang]?.[key] || i18n.en[key] || String(key);
}

export { en, hi };
