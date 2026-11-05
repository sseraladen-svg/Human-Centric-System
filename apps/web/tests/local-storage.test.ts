import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('../public/prototype/storage.js', import.meta.url), 'utf8');

function makeStorage() {
  const entries = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => entries.set(key, String(value)),
    removeItem: (key: string) => entries.delete(key),
  };
  const window = {
    localStorage,
    crypto: { randomUUID: () => `profile-${entries.size}` },
    console: { error: () => undefined },
  };
  runInNewContext(source, { window, console: window.console, Date, Math, JSON, String });
  return { storage: (window as any).HunterStorage, localStorage };
}

describe('browser profile storage', () => {
  it('checks browser storage availability without writing before consent', () => {
    const { storage, localStorage } = makeStorage();
    expect(storage.isAvailable()).toBe(true);
    expect(localStorage.getItem('hunter.localProfiles.v1')).toBe(null);
  });

  it('requires explicit consent before creating a local profile', () => {
    const { storage } = makeStorage();
    expect(() => storage.createProfile({ name: 'Rin', initialState: {}, localConsent: false })).toThrow(
      'Confirm local storage consent',
    );
    expect(storage.listProfiles()).toHaveLength(0);
  });

  it('stores separate profiles and restores the selected profile state', () => {
    const { storage } = makeStorage();
    const first = storage.createProfile({
      name: 'Rin',
      initialState: { xp: 20 },
      localConsent: true,
      cloudConsent: false,
    });
    storage.saveState({ xp: 50, name: 'Rin' });
    const second = storage.createProfile({
      name: 'Kai',
      initialState: { xp: 5 },
      localConsent: true,
      cloudConsent: false,
    });

    expect(storage.loadActiveState().xp).toBe(5);
    expect(storage.activateProfile(first.profile.id).state.xp).toBe(50);
    expect(storage.activateProfile(second.profile.id).state.xp).toBe(5);
    expect(storage.listProfiles()).toHaveLength(2);
  });

  it('keeps new profiles local unless cloud sync consent is separately granted', () => {
    const { storage } = makeStorage();
    storage.createProfile({ name: 'Rin', initialState: {}, localConsent: true });
    expect(storage.cloudConsent()).toBe(false);
    storage.setCloudConsent(true);
    expect(storage.cloudConsent()).toBe(true);
    storage.setCloudConsent(false);
    expect(storage.cloudConsent()).toBe(false);
  });

  it('does not persist changes in session-only mode', () => {
    const { storage } = makeStorage();
    storage.createProfile({ name: 'Rin', initialState: { xp: 10 }, localConsent: true });
    storage.setSessionOnly();
    expect(storage.saveState({ xp: 100 })).toBe(false);
    expect(storage.activeProfile()).toBe(null);
  });

  it('deletes profile data when the active profile is forgotten', () => {
    const { storage, localStorage } = makeStorage();
    storage.createProfile({ name: 'Rin', initialState: { xp: 10 }, localConsent: true });
    const stateKey = storage.activeProfile().stateKey;
    expect(storage.forgetActiveProfile()).toBe(true);
    expect(localStorage.getItem(stateKey)).toBe(null);
    expect(storage.activeProfile()).toBe(null);
    expect(storage.listProfiles()).toHaveLength(0);
  });
});
