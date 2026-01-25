import { useModalContext } from '@shared/providers/modal-provider';
import { useEffect, useRef } from 'react';

const MIN_CHROME = 73;
const MIN_EDGE = 79;
const MIN_SAFARI = 12;
const BROWSER_CHECK_KEY = 'browser-compatibility-checked';

export function BrowserCompatibilityChecker() {
  const { alert } = useModalContext();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    // Check if already shown before
    if (localStorage.getItem(BROWSER_CHECK_KEY)) return;

    const checkBrowser = async () => {
      const ua = navigator.userAgent;

      // Firefox warning
      if (ua.includes('Firefox')) {
        await alert('⚠️ Firefox puede presentar problemas.\nRecomendamos Chrome o Edge.');
      } else {
        // Version checks
        const checks = [
          [/Chrome\/(\d+)/, MIN_CHROME, 'Chrome'],
          [/Edg\/(\d+)/, MIN_EDGE, 'Edge'],
          [/Version\/(\d+).*Safari/, MIN_SAFARI, 'Safari'],
        ] as const;

        for (const [regex, min, name] of checks) {
          const match = ua.match(regex);
          if (match && parseInt(match[1]) < min) {
            await alert(`⚠️ ${name} ${match[1]} no compatible.\nActualice a ${name} ≥${min}.`);
            break;
          }
        }
      }

      // Mark as checked regardless of whether we showed an alert
      localStorage.setItem(BROWSER_CHECK_KEY, 'true');
    };

    checkBrowser();
  }, [alert]);

  return null;
}
