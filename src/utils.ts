export const formatNumberShort = (num: number): string => {
  if (num === 0) return '0';
  const absNum = Math.abs(num);
  if (absNum < 1000) return num.toLocaleString();

  const suffixes = [
    '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc',
    'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod', 'Vg',
    'Uvg', 'Dvg', 'Tvg', 'Qavg', 'Qivg', 'Sxvg', 'Spvg', 'Ocvg', 'Novg', 'Tg'
  ];

  const exponent = Math.floor(Math.log10(absNum) / 3);
  const suffixIndex = Math.min(exponent, suffixes.length - 1);
  
  const shortValue = num / Math.pow(10, suffixIndex * 3);
  
  let formatted = shortValue.toFixed(2);
  if (formatted.includes('e')) {
    const parts = formatted.split('e');
    const base = parts[0];
    const power = parseInt(parts[1]);
    if (power > 0) {
      const dotIndex = base.indexOf('.');
      let cleanBase = base.replace('.', '');
      if (dotIndex === -1) {
        formatted = cleanBase + '0'.repeat(power);
      } else {
        const afterDot = base.length - dotIndex - 1;
        if (power >= afterDot) {
          formatted = cleanBase + '0'.repeat(power - afterDot);
        } else {
          formatted = cleanBase.slice(0, dotIndex + power) + '.' + cleanBase.slice(dotIndex + power);
        }
      }
    }
  }
  
  formatted = formatted.replace(/\.?0+$/, '');
  return formatted + suffixes[suffixIndex];
};

export const formatTimeShort = (seconds: number): string => {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
  return seconds + 's';
};

export const formatCurrency = (amount: number): string => {
  return `£${formatNumberShort(amount)}`;
};
