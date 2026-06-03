import { DailyRecord, SkaterProfile } from '../types';

const PROFILES_KEY = 'parth-skating-planner-profiles-v2';
const ACTIVE_PROFILE_KEY = 'parth-skating-planner-active-id-v2';
const LEGACY_DATA_KEY = 'parth-skating-planner-v1';

export class StorageService {
  // Profiles Management
  static getProfiles(): SkaterProfile[] {
    const data = localStorage.getItem(PROFILES_KEY);
    if (!data) {
        // If no profiles, check if legacy data exists to create "Parth"
        const legacyData = localStorage.getItem(LEGACY_DATA_KEY);
        if (legacyData) {
            const parth: SkaterProfile = { id: 'parth-legacy', name: 'Parth', createdAt: new Date().toISOString() };
            this.saveProfiles([parth]);
            // Migrate legacy data to new key
            localStorage.setItem(`skate-data-parth-legacy`, legacyData);
            return [parth];
        }
        return [];
    }
    return JSON.parse(data);
  }

  static saveProfiles(profiles: SkaterProfile[]): void {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  }

  static getActiveProfileId(): string | null {
    return localStorage.getItem(ACTIVE_PROFILE_KEY);
  }

  static setActiveProfileId(id: string): void {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  }

  // Data Management per Profile
  private static getStoredData(profileId: string): Record<string, DailyRecord> {
    const data = localStorage.getItem(`skate-data-${profileId}`);
    if (!data) return {};
    try {
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  }

  static async getRecord(profileId: string, date: string): Promise<DailyRecord | null> {
    const data = this.getStoredData(profileId);
    return data[date] || null;
  }

  static async saveRecord(profileId: string, record: DailyRecord): Promise<void> {
    const data = this.getStoredData(profileId);
    data[record.date] = record;
    localStorage.setItem(`skate-data-${profileId}`, JSON.stringify(data));
  }

  static async getAllRecords(profileId: string): Promise<Record<string, DailyRecord>> {
    return this.getStoredData(profileId);
  }

  static async exportData(profileId: string): Promise<string> {
    return JSON.stringify(this.getStoredData(profileId), null, 2);
  }

  static async importData(profileId: string, json: string): Promise<void> {
    try {
      const data = JSON.parse(json);
      localStorage.setItem(`skate-data-${profileId}`, JSON.stringify(data));
    } catch (e) {
      throw new Error('Invalid JSON format');
    }
  }
}
