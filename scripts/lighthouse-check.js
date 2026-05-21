#!/usr/bin/env node
/**
 * SUPERBRAND Premium Web Skill - Lighthouse Check
 *
 * Wrapper um @lhci/cli der das richtige Budget basierend auf
 * dem Site-Typ aus story-spec.json lädt und durchsetzt.
 *
 * Aufruf:
 *   node scripts/lighthouse-check.js                  # nutzt story-spec.json im Root
 *   node scripts/lighthouse-check.js --type standard  # explizit überschreiben
 *   node scripts/lighthouse-check.js --url http://localhost:3000
 *
 * Voraussetzung: @lhci/cli installiert (npm install -D @lhci/cli)
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const BUDGETS = {
  standard_business: {
    performance: 0.85,
    accessibility: 0.95,
    'best-practices': 0.90,
    seo: 0.90,
    'largest-contentful-paint': 2500,
    'cumulative-layout-shift': 0.1,
    'interaction-to-next-paint': 200,
    'total-byte-weight': 3_000_000,
  },
  scrollytelling_premium: {
    performance: 0.75,
    accessibility: 0.95,
    'best-practices': 0.90,
    seo: 0.90,
    'largest-contentful-paint': 3000,
    'cumulative-layout-shift': 0.1,
    'interaction-to-next-paint': 200,
    'total-byte-weight': 8_000_000,
  },
  conversion_landing: {
    performance: 0.90,
    accessibility: 0.95,
    'best-practices': 0.95,
    seo: 0.85,
    'largest-contentful-paint': 2000,
    'cumulative-layout-shift': 0.05,
    'interaction-to-next-paint': 150,
    'total-byte-weight': 2_000_000,
  },
}

function parseArgs(argv) {
  const args = { type: null, url: 'http://localhost:3000' }
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--type') args.type = argv[++i]
    else if (argv[i] === '--url') args.url = argv[++i]
  }
  return args
}

function readSiteTypeFromSpec() {
  const specPath = path.join(process.cwd(), 'story-spec.json')
  if (!fs.existsSync(specPath)) return null
  try {
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'))
    return spec.type || null
  } catch {
    return null
  }
}

function writeLhciConfig(siteType, url) {
  const budget = BUDGETS[siteType]
  if (!budget) {
    console.error(`❌ Unbekannter Site-Typ: "${siteType}"`)
    console.error(`   Erlaubt: ${Object.keys(BUDGETS).join(', ')}`)
    process.exit(1)
  }

  const config = {
    ci: {
      collect: {
        url: [url],
        numberOfRuns: 3,
        settings: { preset: 'desktop' },
      },
      assert: {
        assertions: {
          'categories:performance': ['error', { minScore: budget.performance }],
          'categories:accessibility': ['error', { minScore: budget.accessibility }],
          'categories:best-practices': ['error', { minScore: budget['best-practices'] }],
          'categories:seo': ['warn', { minScore: budget.seo }],
          'largest-contentful-paint': ['error', { maxNumericValue: budget['largest-contentful-paint'] }],
          'cumulative-layout-shift': ['error', { maxNumericValue: budget['cumulative-layout-shift'] }],
          'interaction-to-next-paint': ['warn', { maxNumericValue: budget['interaction-to-next-paint'] }],
          'total-byte-weight': ['warn', { maxNumericValue: budget['total-byte-weight'] }],
        },
      },
      upload: {
        target: 'filesystem',
        outputDir: './qa-reports/lighthouse',
      },
    },
  }

  fs.writeFileSync('.lighthouserc.json', JSON.stringify(config, null, 2))
  return config
}

function ensureReportDir() {
  const dir = path.join(process.cwd(), 'qa-reports', 'lighthouse')
  fs.mkdirSync(dir, { recursive: true })
}

function main() {
  const args = parseArgs(process.argv)
  const siteType = args.type || readSiteTypeFromSpec()

  if (!siteType) {
    console.error('❌ Kein Site-Typ angegeben.')
    console.error('   --type angeben ODER story-spec.json im Projekt-Root mit "type"-Feld bereitstellen.')
    process.exit(1)
  }

  console.log(`🔍 Lighthouse-Check für Site-Typ: ${siteType}`)
  console.log(`   URL: ${args.url}`)

  ensureReportDir()
  writeLhciConfig(siteType, args.url)

  try {
    console.log('\n📊 Collecting Lighthouse runs (3x)...')
    execSync('npx lhci collect', { stdio: 'inherit' })

    console.log('\n✅ Asserting against budgets...')
    execSync('npx lhci assert', { stdio: 'inherit' })

    console.log(`\n🎉 Lighthouse-Check bestanden für ${siteType}`)
  } catch (err) {
    console.error(`\n❌ Lighthouse-Check FAILED für ${siteType}`)
    console.error('   Reports unter ./qa-reports/lighthouse/')
    process.exit(1)
  }
}

main()
