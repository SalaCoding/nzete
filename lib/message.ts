export const getRatingMessage = (
  score: number | null,
  options: {
    lang?: string;
    tense?: 'present' | 'past';
    fallback?: string;
  } = {}
): string => {
  const lang = (options.lang || 'en').toLowerCase();
  const tense = options.tense || 'present';

  if (score === null || score <= 0) {
    return options.fallback || (
      lang === 'ln'
        ? 'Tozelaki eyano, kasi eloko moko etamboli malamu te.'
        : 'We expected feedback, but something went wrong.'
    );
  }

  const noun = score === 1
    ? (lang === 'ln' ? 'monzoto' : 'star')
    : (lang === 'ln' ? 'minzoto' : 'stars');

  const verb = lang === 'ln'
    ? (tense === 'past' ? 'Opesaki' : 'Opesi')
    : (tense === 'past' ? 'You gave' : 'You’re giving');

  return `✅ ${verb} ${score} ${noun}`;
};
