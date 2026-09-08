(() => {
  const SHORT_WORDS = [
    'а', 'в', 'во', 'и', 'к', 'ко', 'на', 'о', 'об', 'обо', 'от', 'ото',
    'по', 'под', 'подо', 'с', 'со', 'у', 'из', 'изо', 'за', 'до', 'для',
    'без', 'безо', 'при', 'про', 'над', 'надо', 'перед', 'передо',
    'через', 'между', 'среди', 'около', 'возле', 'кроме', 'ради',
    'вместо', 'внутри', 'вне', 'после', 'против', 'сквозь',
    'но', 'да', 'или', 'либо', 'ни', 'то', 'не',
    'же', 'ли', 'бы', 'б', 'ж',
    'это', 'как', 'что', 'чтобы', 'если', 'когда',
    'он', 'она', 'они', 'оно', 'мы', 'вы', 'ты', 'я',
    'его', 'её', 'их', 'им', 'ей', 'ему',
  ];

  const WORD_RE = new RegExp(
    `(^|[^\\p{L}\\p{N}_])(${SHORT_WORDS.join('|')})( )(?=[\\p{L}\\p{N}])`,
    'giu',
  );

  const SKIP_TAGS = new Set([
    'SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE', 'KBD', 'SAMP', 'INPUT', 'SELECT', 'OPTION',
  ]);

  function fixText(text) {
    let result = text
      .replace(/(\d) (\d{3}\b)/g, '$1\u00A0$2')
      .replace(/(№) /g, '$1\u00A0')
      .replace(/(\d) (°|%|₽|€|\$|кг|г|км|м|см|мм|шт)/gi, '$1\u00A0$2')
      .replace(/(и) (т\.) (д\.|п\.)/gi, '$1\u00A0$2\u00A0$3');

    let prev;
    do {
      prev = result;
      result = result.replace(WORD_RE, '$1$2\u00A0');
    } while (result !== prev);

    return result;
  }

  function shouldSkip(node) {
    let el = node.parentElement;
    while (el) {
      if (SKIP_TAGS.has(el.tagName) || el.isContentEditable) return true;
      el = el.parentElement;
    }
    return false;
  }

  function processRoot(root) {
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      if (!node.nodeValue || !node.nodeValue.includes(' ') || shouldSkip(node)) return;
      const next = fixText(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    });
  }

  const run = () => processRoot(document.body);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
