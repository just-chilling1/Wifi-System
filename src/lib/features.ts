import { isFeatureEnabled } from "@/config/features.config"
import {
  bottomNavMoreLinks,
  bottomNavTabs,
  homeNav,
  mainNav,
  mainNavSections,
  premiumNav,
  supportNav,
  type NavItem,
  type NavSection,
} from "@/config/navigation.config"

function filterNav(items: NavItem[]): NavItem[] {
  return items.filter((item) => !item.feature || isFeatureEnabled(item.feature))
}

export function getMainNav(): NavItem[] {
  return filterNav(mainNav)
}

export function getMainNavSections(): NavSection[] {
  return mainNavSections
    .map((section) => ({ ...section, items: filterNav(section.items) }))
    .filter((section) => section.items.length > 0)
}

export function getVisiblePremiumNav(): NavItem[] {
  return filterNav(premiumNav)
}

export function getSupportNav(): NavItem | null {
  if (supportNav.feature && !isFeatureEnabled(supportNav.feature)) return null
  return supportNav
}

export function getBottomNavTabs(): NavItem[] {
  return filterNav(bottomNavTabs).slice(0, 4)
}

export function getBottomNavMoreLinks(): NavItem[] {
  const tabPaths = new Set(getBottomNavTabs().map((t) => t.path))
  const premiumPaths = new Set(getVisiblePremiumNav().map((t) => t.path))
  const seen = new Set<string>()

  return filterNav(bottomNavMoreLinks).filter((item) => {
    if (item.path === supportNav.path) return false
    if (tabPaths.has(item.path) || premiumPaths.has(item.path)) return false
    if (seen.has(item.path)) return false
    seen.add(item.path)
    return true
  })
}

export function getHomeNav(): NavItem {
  return homeNav
}
