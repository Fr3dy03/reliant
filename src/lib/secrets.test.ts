import { describe, expect, it } from 'vitest';
import { decryptSecret, encryptSecret } from './secrets';
describe('secret vault', () => { it('round trips encrypted values', () => { const value = 'agent-key-123'; expect(decryptSecret(encryptSecret(value))).toBe(value); }); it('does not store plaintext', () => { expect(encryptSecret('agent-key-123')).not.toContain('agent-key-123'); }); });