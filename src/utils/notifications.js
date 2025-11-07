// Sistema de notificações do navegador

export function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('Este navegador não suporta notificações')
    return Promise.resolve(false)
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve(true)
  }

  if (Notification.permission !== 'denied') {
    return Notification.requestPermission().then(permission => {
      return permission === 'granted'
    })
  }

  return Promise.resolve(false)
}

export function showNotification(title, options = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return
  }

  const notification = new Notification(title, {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    ...options
  })

  notification.onclick = () => {
    window.focus()
    notification.close()
  }

  return notification
}

export function scheduleWaterReminder(intervalMinutes = 60) {
  if (!('Notification' in window)) return

  const schedule = () => {
    setTimeout(() => {
      showNotification('💧 Lembrete de Água', {
        body: 'Está na hora de beber água! Mantenha-se hidratado.',
        tag: 'water-reminder',
        requireInteraction: false
      })
      schedule() // Agendar próximo
    }, intervalMinutes * 60 * 1000)
  }

  schedule()
}

export function checkAndNotifyGoals(calorias, metaCalorias, agua, metaAgua) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return
  }

  // Notificar quando meta de calorias é atingida
  if (calorias >= metaCalorias * 0.95 && calorias <= metaCalorias * 1.05) {
    showNotification('🎯 Meta de Calorias Atingida!', {
      body: `Você atingiu sua meta de ${metaCalorias} kcal! Parabéns!`,
      tag: 'calorie-goal',
      requireInteraction: false
    })
  }

  // Notificar quando meta de água é atingida
  if (agua >= metaAgua * 0.95) {
    showNotification('💧 Meta de Água Atingida!', {
      body: `Você atingiu sua meta de ${(metaAgua / 1000).toFixed(1)}L de água! Parabéns!`,
      tag: 'water-goal',
      requireInteraction: false
    })
  }

  // Avisar quando ultrapassar calorias
  if (calorias > metaCalorias * 1.1) {
    showNotification('⚠️ Atenção: Calorias Ultrapassadas', {
      body: `Você ultrapassou sua meta em ${Math.round(calorias - metaCalorias)} kcal`,
      tag: 'calorie-warning',
      requireInteraction: false
    })
  }
}

