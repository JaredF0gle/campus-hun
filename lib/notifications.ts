import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export async function registerForNotifications() {
  const { status } = await Notifications.requestPermissionsAsync()
  if (status !== 'granted') return null
  const token = await Notifications.getExpoPushTokenAsync()
  return token.data
}

export async function sendLocalNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  })
}