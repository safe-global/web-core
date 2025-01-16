import { Platform } from 'react-native'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import * as TaskManager from 'expo-task-manager'
import { BACKGROUND_NOTIFICATION_TASK, STORAGE_IDS } from '@/src/store/constants'
import Logger from '@/src/utils/logger'

function handleRegistrationError(errorMessage: string) {
  // TODO: Handle any visual feedback to the user
  Logger.error(errorMessage)
}

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync(STORAGE_IDS.DEFAULT_NOTIFICATION_CHANNEL_ID, {
      name: STORAGE_IDS.DEFAULT_NOTIFICATION_CHANNEL_ID,
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!')
      return
    }
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId
    if (!projectId) {
      handleRegistrationError('Project ID not found')
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data
      console.log(pushTokenString)
      return pushTokenString
    } catch (e: unknown) {
      handleRegistrationError(`${e}`)
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications')
  }
}

export async function initNotificationService(): Promise<void> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  })
  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error, executionInfo }) => {
    console.log('✅ Received a notification in the background!', {
      data,
      error,
      executionInfo,
    })
    // TODO: Implement Notifee to handle notifications in the background
    return Promise.resolve()
  })
  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)
}
