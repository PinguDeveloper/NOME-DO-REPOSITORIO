// Gerenciar deviceId único por dispositivo
export function getDeviceId() {
  let deviceId = localStorage.getItem('deviceId')
  
  if (!deviceId) {
    // Gerar um ID único baseado em timestamp + random
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('deviceId', deviceId)
  }
  
  return deviceId
}

export function resetDeviceId() {
  localStorage.removeItem('deviceId')
  return getDeviceId()
}

