import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { updateService } from '../services/UpdateService';
import { AppUpdate } from '../types';

export const useAppUpdate = () => {
  const [updateInfo, setUpdateInfo] = useState<AppUpdate>({
    isAvailable: false,
    currentVersion: updateService.getCurrentVersion(),
  });
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * Check for available updates
   */
  const checkForUpdates = useCallback(async (showAlert: boolean = false) => {
    setIsChecking(true);
    try {
      const update = await updateService.checkForUpdates();
      setUpdateInfo(update);

      if (showAlert) {
        if (update.isAvailable) {
          Alert.alert(
            'Update Available',
            `A new version (${update.availableVersion}) is available. Would you like to download it?`,
            [
              { text: 'Later', style: 'cancel' },
              { text: 'Download', onPress: downloadUpdate },
            ]
          );
        } else {
          Alert.alert('No Updates', 'You are running the latest version.');
        }
      }

      return update;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return updateInfo;
    } finally {
      setIsChecking(false);
    }
  }, []);

  /**
   * Download available update
   */
  const downloadUpdate = useCallback(async () => {
    setIsDownloading(true);
    try {
      const success = await updateService.downloadAndInstallUpdate();
      
      if (success) {
        Alert.alert(
          'Update Ready',
          'The update has been downloaded. Would you like to restart the app now?',
          [
            { text: 'Later', style: 'cancel' },
            { text: 'Restart Now', onPress: applyUpdate },
          ]
        );
      }

      return success;
    } catch (error) {
      console.error('Error downloading update:', error);
      Alert.alert('Update Failed', 'Could not download the update. Please try again later.');
      return false;
    } finally {
      setIsDownloading(false);
    }
  }, []);

  /**
   * Apply downloaded update and reload app
   */
  const applyUpdate = useCallback(async () => {
    try {
      await updateService.reloadApp();
    } catch (error) {
      console.error('Error applying update:', error);
      Alert.alert('Error', 'Could not apply the update. Please restart the app manually.');
    }
  }, []);

  /**
   * Get current version info
   */
  const getCurrentVersion = useCallback(() => {
    return updateService.getCurrentVersion();
  }, []);

  /**
   * Check if running in development
   */
  const isDevelopment = useCallback(() => {
    return updateService.isRunningInDevelopment();
  }, []);

  /**
   * Auto-check for updates on mount (optional)
   */
  useEffect(() => {
    // Optionally check for updates on component mount
    // checkForUpdates(false);
  }, []);

  return {
    updateInfo,
    isChecking,
    isDownloading,
    checkForUpdates,
    downloadUpdate,
    applyUpdate,
    getCurrentVersion,
    isDevelopment,
  };
};

