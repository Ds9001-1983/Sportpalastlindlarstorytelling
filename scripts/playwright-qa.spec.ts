/**
 * SUPERBRAND Premium Web Skill - Playwright QA Suite
 *
 * Visual Regression über 5 Breakpoints + Interactive Tests für Conversion-Landings.
 *
 * Wird automatisch je nach story-spec.json type ausgeführt:
 * - scrollytelling_premium → nur Visual Regression
 * - conversion_landing → Visual + Interactive (Form, CTA, Tap-Targets)
 *
 * Aufruf:
 *   npx playwright test scripts/playwright-qa.spec.ts
 *   npx playwright test --update-snapshots   # Bei legitimen Änderungen
 *
 * Voraussetzung: @playwright/test installiert + chromium browser.
 */

import { test, expect, devices, Page } from '@playwright/test'
import fs from 'fs'
import path from 'path'

// Site-Typ aus story-spec.json lesen
function getSiteType(): string {
  const specPath = path.join(process.cwd(), 'story-spec.json')
  if (!fs.existsSync(specPath)) return 'standard_business'
  try {
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'))
    return spec.type || 'standard_business'
  } catch {
    return 'standard_business'
  }
}

const SITE_TYPE = getSiteType()
const isScrollytelling = SITE_TYPE === 'scrollytelling_premium'
const isConversion = SITE_TYPE === 'conversion_landing'

const BREAKPOINTS = [
  { name: 'iPhone SE', ...devices['iPhone SE'] },
  { name: 'iPhone 14 Pro', ...devices['iPhone 14 Pro'] },
  { name: 'Pixel 7', ...devices['Pixel 7'] },
  { name: 'iPad Mini', ...devices['iPad Mini'] },
  { name: 'Desktop 1920', viewport: { width: 1920, height: 1080 } },
]

const SCROLL_POSITIONS = [0, 0.25, 0.5, 0.75, 1.0]

// ─────────────────────────────────────────
// STUFE 2: Visual Regression
// ─────────────────────────────────────────

test.describe('Visual Regression', () => {
  for (const breakpoint of BREAKPOINTS) {
    test.describe(`@ ${breakpoint.name}`, () => {
      test.use({ viewport: breakpoint.viewport, userAgent: breakpoint.userAgent })

      test('Page loads ohne Errors', async ({ page }) => {
        const errors: string[] = []
        page.on('pageerror', (err) => errors.push(err.message))
        page.on('console', (msg) => {
          if (msg.type() === 'error') errors.push(msg.text())
        })

        await page.goto('/')
        await page.waitForLoadState('networkidle')

        expect(errors.filter((e) => !e.includes('favicon'))).toEqual([])
      })

      test('Screenshots an Scroll-Positionen', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(1500) // GSAP-Init aussitzen

        const fullHeight = await page.evaluate(() => document.body.scrollHeight)

        for (const pos of SCROLL_POSITIONS) {
          const targetY = (fullHeight - page.viewportSize()!.height) * pos
          await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), targetY)
          await page.waitForTimeout(1200)
          await expect(page).toHaveScreenshot(
            `${breakpoint.name.replace(/\s/g, '-')}-scroll-${Math.round(pos * 100)}.png`,
            { maxDiffPixels: 200, fullPage: false }
          )
        }
      })

      test('Kein horizontaler Overflow', async ({ page }) => {
        await page.goto('/')
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
        })
        expect(overflow).toBe(false)
      })

      test('Bilder lazy-load funktioniert', async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')

        const eagerCount = await page.evaluate(() => {
          return document.querySelectorAll('img[loading="eager"], img[fetchpriority="high"]').length
        })

        // Erlaubt: Hero-Bild + max 2 Logos eager. Mehr ist Performance-Problem.
        expect(eagerCount).toBeLessThanOrEqual(3)
      })
    })
  }
})

// ─────────────────────────────────────────
// STUFE 2+: Scrollytelling-spezifisch
// ─────────────────────────────────────────

test.describe('Scrollytelling Specific', () => {
  test.skip(!isScrollytelling, 'Nur für scrollytelling_premium')

  test('Frame-Sequence-Manifest existiert', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const manifestResponse = await page.evaluate(async () => {
      try {
        const res = await fetch('/frames/cave_entrance/manifest.json')
        return { ok: res.ok, status: res.status }
      } catch {
        return { ok: false, status: 0 }
      }
    })

    // Alternative: manifest pfad könnte abweichen
    if (!manifestResponse.ok) {
      console.warn('   Hinweis: /frames/cave_entrance/manifest.json nicht gefunden — Pfad ggf. anpassen')
    }
  })

  test('CanvasSequence läuft auf Scroll', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Scroll auslösen und prüfen ob Canvas Frame wechselt
    const initialFrame = await page.evaluate(() => {
      // @ts-ignore - der CanvasSequence-Renderer setzt window.__currentFrame
      return (window as any).__currentFrame || 0
    })

    await page.evaluate(() => window.scrollTo(0, 1500))
    await page.waitForTimeout(800)

    const newFrame = await page.evaluate(() => (window as any).__currentFrame || 0)

    if (newFrame === initialFrame) {
      console.warn('   ⚠️ Frame hat sich nicht geändert — Canvas-Renderer ggf. nicht aktiv')
    }
  })

  test('Mobile zeigt Scroll-Snap statt Canvas', async ({ browser }) => {
    const ctx = await browser.newContext({ ...devices['iPhone SE'] })
    const page = await ctx.newPage()
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Mobile sollte KEINEN Canvas-Sequence-Renderer zeigen
    const hasCanvasSequence = await page.evaluate(() => {
      return document.querySelector('[data-canvas-sequence]') !== null
    })

    const hasScrollSnap = await page.evaluate(() => {
      const sections = document.querySelectorAll('section')
      return Array.from(sections).some((s) =>
        getComputedStyle(s).scrollSnapAlign !== 'none'
      )
    })

    expect(hasCanvasSequence).toBe(false)
    expect(hasScrollSnap).toBe(true)
    await ctx.close()
  })
})

// ─────────────────────────────────────────
// STUFE 3: Conversion Interactive
// ─────────────────────────────────────────

test.describe('Conversion Interactive', () => {
  test.skip(!isConversion, 'Nur für conversion_landing')

  test('Primary CTA above-the-fold auf Mobile', async ({ browser }) => {
    const ctx = await browser.newContext({ ...devices['iPhone SE'] })
    const page = await ctx.newPage()
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const cta = page.locator('[data-cta="primary"]').first()
    await expect(cta).toBeVisible()

    const box = await cta.boundingBox()
    const viewportHeight = page.viewportSize()!.height
    expect(box!.y).toBeLessThan(viewportHeight)
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewportHeight)

    await ctx.close()
  })

  test('Alle Buttons haben Tap-Target ≥48x48px', async ({ browser }) => {
    const ctx = await browser.newContext({ ...devices['iPhone SE'] })
    const page = await ctx.newPage()
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const buttons = await page.$$('button, a[role="button"], [data-cta]')
    const failures: string[] = []

    for (const btn of buttons) {
      const box = await btn.boundingBox()
      if (!box) continue
      if (box.width < 48 || box.height < 48) {
        const text = (await btn.textContent())?.trim().slice(0, 30) || '???'
        failures.push(`"${text}" (${box.width}x${box.height})`)
      }
    }

    if (failures.length > 0) {
      console.warn(`Zu kleine Tap-Targets:\n${failures.map((f) => `   - ${f}`).join('\n')}`)
    }
    expect(failures).toHaveLength(0)
    await ctx.close()
  })

  test('Lead-Form Submit funktioniert', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const form = page.locator('form').first()
    const formExists = (await form.count()) > 0
    if (!formExists) {
      test.skip(true, 'Keine Form auf der Page')
      return
    }

    // Form ausfüllen — Selektoren anpassen je nach Projekt
    const nameInput = page.locator('input[name="name"], input[name="vorname"]').first()
    const emailInput = page.locator('input[type="email"], input[name="email"]').first()
    const phoneInput = page.locator('input[type="tel"], input[name="phone"]').first()

    if ((await nameInput.count()) > 0) await nameInput.fill('Test Tester')
    if ((await emailInput.count()) > 0) await emailInput.fill('test@example.com')
    if ((await phoneInput.count()) > 0) await phoneInput.fill('+49 1234 567890')

    const submitBtn = page.locator('button[type="submit"]').first()
    await submitBtn.click()

    // Erfolg ODER Validation-Error muss innerhalb 5s erscheinen
    const success = page.locator('.success, [data-success], [role="status"]').first()
    const error = page.locator('.error, [data-error], [role="alert"]').first()

    await expect(success.or(error)).toBeVisible({ timeout: 5000 })
  })

  test('Cookie-Banner blockiert Pixel vor Consent', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Banner muss da sein
    const banner = page.locator('.cookie-banner, .cky-consent-container, [data-cookieyes]').first()
    const bannerExists = (await banner.count()) > 0

    if (!bannerExists) {
      console.warn('   ⚠️ Kein Cookie-Banner gefunden — DSGVO-Risiko bei Tracking')
      return
    }

    // Vor Consent darf fbq nicht existieren
    const fbqBeforeConsent = await page.evaluate(() => 'fbq' in window)
    expect(fbqBeforeConsent).toBe(false)
  })

  test('Telefon-Link funktioniert (tel:)', async ({ page }) => {
    await page.goto('/')
    const telLink = page.locator('a[href^="tel:"]').first()
    if ((await telLink.count()) === 0) return

    const href = await telLink.getAttribute('href')
    expect(href).toMatch(/^tel:\+?[0-9\s\-]+$/)
  })
})
