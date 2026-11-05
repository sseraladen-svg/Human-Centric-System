(function () {
  const REGISTRY_KEY = 'hunter.localProfiles.v1';
  const ACTIVE_PROFILE_KEY = 'hunter.activeLocalProfile.v1';
  const LEGACY_STATE_KEY = 'hunter.v3';
  const PROFILE_STATE_PREFIX = 'hunter.v3.profile.';
  let sessionOnly = false;

  function readJson(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      console.error('Could not read saved browser data.', error);
      return fallback;
    }
  }

  function listProfiles() {
    const profiles = readJson(REGISTRY_KEY, []);
    if (!Array.isArray(profiles)) return [];
    return profiles.filter(profile =>
      profile &&
      typeof profile.id === 'string' &&
      typeof profile.name === 'string' &&
      typeof profile.stateKey === 'string' &&
      profile.localConsent === true
    );
  }

  function activeProfile() {
    if (sessionOnly) return null;
    let id;
    try {
      id = window.localStorage.getItem(ACTIVE_PROFILE_KEY);
    } catch (error) {
      return null;
    }
    return listProfiles().find(profile => profile.id === id) || null;
  }

  function profileState(profile) {
    if (!profile) return null;
    const state = readJson(profile.stateKey, null);
    return state && typeof state === 'object' && !Array.isArray(state) ? state : null;
  }

  function makeId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return 'local-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  }

  function createProfile({ name, initialState, localConsent, cloudConsent }) {
    if (localConsent !== true) throw new Error('Confirm local storage consent to create a profile.');
    const displayName = String(name || '').trim();
    if (!displayName) throw new Error('Enter a profile name.');
    const id = makeId();
    const stateKey = PROFILE_STATE_PREFIX + id;
    const state = initialState && typeof initialState === 'object' && !Array.isArray(initialState)
      ? JSON.parse(JSON.stringify(initialState))
      : {};
    state.name = displayName;

    const profile = {
      id,
      name: displayName,
      stateKey,
      localConsent: true,
      cloudConsent: cloudConsent === true,
      createdAt: new Date().toISOString()
    };

    window.localStorage.setItem(stateKey, JSON.stringify(state));
    window.localStorage.setItem(REGISTRY_KEY, JSON.stringify(listProfiles().concat(profile)));
    window.localStorage.setItem(ACTIVE_PROFILE_KEY, id);
    sessionOnly = false;
    return { profile, state };
  }

  function activateProfile(id) {
    const profile = listProfiles().find(item => item.id === id);
    if (!profile) throw new Error('That local profile is unavailable.');
    window.localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
    sessionOnly = false;
    return { profile, state: profileState(profile) };
  }

  function saveState(state) {
    if (sessionOnly) return false;
    const profile = activeProfile();
    if (!profile) return false;
    window.localStorage.setItem(profile.stateKey, JSON.stringify(state));
    return true;
  }

  function setCloudConsent(enabled) {
    const current = activeProfile();
    if (!current) throw new Error('Create or select a local profile first.');
    const updated = Object.assign({}, current, { cloudConsent: enabled === true });
    const profiles = listProfiles().map(profile => profile.id === current.id ? updated : profile);
    window.localStorage.setItem(REGISTRY_KEY, JSON.stringify(profiles));
    return updated.cloudConsent;
  }

  function setSessionOnly() {
    sessionOnly = true;
  }

  function forgetActiveProfile() {
    const current = activeProfile();
    if (!current) return false;
    window.localStorage.removeItem(current.stateKey);
    window.localStorage.setItem(
      REGISTRY_KEY,
      JSON.stringify(listProfiles().filter(profile => profile.id !== current.id))
    );
    window.localStorage.removeItem(ACTIVE_PROFILE_KEY);
    sessionOnly = false;
    return true;
  }

  function isAvailable() {
    try {
      window.localStorage.getItem(REGISTRY_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  function loadLegacyState() {
    return readJson(LEGACY_STATE_KEY, null);
  }

  window.HunterStorage = {
    activeProfile,
    activateProfile,
    cloudConsent: () => !!(activeProfile() && activeProfile().cloudConsent),
    createProfile,
    forgetActiveProfile,
    isAvailable,
    listProfiles,
    loadActiveState: () => profileState(activeProfile()),
    loadLegacyState,
    saveState,
    setCloudConsent,
    setSessionOnly,
    sessionOnly: () => sessionOnly
  };
})();
