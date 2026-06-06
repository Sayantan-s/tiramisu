import { Linking } from 'react-native';
import { useInvitesStore } from '../../features/invites/store';

export const INVITE_HOSTS = new Set(['i', 'invite']);

export function parseInviteUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'tiramisu:') return null;
    // tiramisu://i/<code>  →  host = 'i', pathname = '/<code>'
    if (!INVITE_HOSTS.has(parsed.hostname)) return null;
    const code = parsed.pathname.replace(/^\/+/, '').toUpperCase();
    if (!code) return null;
    return code;
  } catch {
    return null;
  }
}

function handleUrl(url: string | null) {
  if (!url) return;
  const code = parseInviteUrl(url);
  if (code) useInvitesStore.getState().setPendingCode(code);
}

export function installDeepLinkHandler(): () => void {
  Linking.getInitialURL().then(handleUrl).catch(() => {});
  const sub = Linking.addEventListener('url', (event) => handleUrl(event.url));
  return () => sub.remove();
}

export function buildInviteUrl(code: string): string {
  return `tiramisu://i/${code.toUpperCase()}`;
}
