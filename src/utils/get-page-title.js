import defaultSettings from '@/settings'

const title = defaultSettings.title || 'SmartTalk'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle}`
  }
  return `${title}`
}
