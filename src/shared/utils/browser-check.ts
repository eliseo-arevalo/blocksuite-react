const MIN_CHROME = 73;
const MIN_EDGE = 79;
const MIN_SAFARI = 12;

export function checkBrowserCompatibility(): void {
  const ua = navigator.userAgent;
  
  // Firefox warning
  if (ua.includes('Firefox')) {
    alert('⚠️ Firefox puede presentar problemas.\nRecomendamos Chrome o Edge.');
    return;
  }
  
  // Version checks
  const checks = [
    [/Chrome\/(\d+)/, MIN_CHROME, 'Chrome'],
    [/Edg\/(\d+)/, MIN_EDGE, 'Edge'], 
    [/Version\/(\d+).*Safari/, MIN_SAFARI, 'Safari']
  ] as const;
  
  for (const [regex, min, name] of checks) {
    const match = ua.match(regex);
    if (match && parseInt(match[1]) < min) {
      alert(`⚠️ ${name} ${match[1]} no compatible.\nActualice a ${name} ≥${min}.`);
      return;
    }
  }
}
