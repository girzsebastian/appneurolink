import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import { AppUpdate } from '../types';

class UpdateService {
  /**
   * Check for available updates
   */
  async checkForUpdates(): Promise<AppUpdate> {
    try {
      // Don't check for updates in development
      if (__DEV__) {
        return {
          isAvailable: false,
          currentVersion: this.getCurrentVersion(),
        };
      }

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        return {
          isAvailable: true,
          currentVersion: this.getCurrentVersion(),
          availableVersion: update.manifest?.version || 'unknown',
          manifest: update.manifest,
        };
      }

      return {
        isAvailable: false,
        currentVersion: this.getCurrentVersion(),
      };
    } catch (error) {
      console.error('Error checking for updates:', error);
      return {
        isAvailable: false,
        currentVersion: this.getCurrentVersion(),
      };
    }
  }

  /**
   * Download and install available update
   */
  async downloadAndInstallUpdate(): Promise<boolean> {
    try {
      if (__DEV__) {
        console.log('Updates not available in development mode');
        return false;
      }

      const result = await Updates.fetchUpdateAsync();
      
      if (result.isNew) {
        // Update downloaded successfully
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error downloading update:', error);
      return false;
    }
  }

  /**
   * Reload the app to apply updates
   */
  async reloadApp(): Promise<void> {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Error reloading app:', error);
    }
  }

  /**
   * Get current app version
   */
  getCurrentVersion(): string {
    return Constants.expoConfig?.version || '1.0.0';
  }

  /**
   * Get current update ID
   */
  getCurrentUpdateId(): string | undefined {
    return Updates.updateId;
  }

  /**
   * Check if running a development build
   */
  isRunningInDevelopment(): boolean {
    return __DEV__;
  }

  /**
   * Get update channel
   */
  getUpdateChannel(): string | undefined {
    return Updates.channel;
  }

  /**
   * Compare version strings (semver)
   */
  compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;

      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }

    return 0;
  }

  /**
   * Check if minimum version requirement is met
   */
  isVersionSupported(currentVersion: string, minVersion: string): boolean {
    return this.compareVersions(currentVersion, minVersion) >= 0;
  }
}

// Export singleton instance
export const updateService = new UpdateService();

