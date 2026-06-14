import en from './en';
import es from './es';
import fr from './fr';
import it from './it';
import pt from './pt';
import ru from './ru';
import type { Dict, Locale } from './index';

const dictionaries: Record<Locale, Dict> = {
  en,
  it,
  pt,
  es,
  ru,
  fr,
};

export function getDictSync(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries.en;
}
