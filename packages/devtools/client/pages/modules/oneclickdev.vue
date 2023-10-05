<script setup lang="ts">
definePageMeta({
  icon: 'carbon-cursor-1',
  title: 'oneclick.dev',
  show: () => {
    const client = useClient()
    return () => !!client.value
  },
  order: 1,
})

const screenWidth = ref(window.innerWidth)
parent.addEventListener('resize', () => {
  screenWidth.value = window.innerWidth
})
// TODO remove resize eventlistener on leave

const layoutSettings = readWebsiteLayoutSettings()

function readWebsiteLayoutSettings() {
  const result = {}

  function getMediaQueryValues(variableName) {
    const values = []

    // Iterate through all the stylesheets
    for (const sheet of document.styleSheets) {
      try {
        // Iterate through the rules inside each stylesheet
        for (const rule of sheet.cssRules) {
          // Check if the rule is a media rule
          if (rule.type === CSSRule.MEDIA_RULE) {
            // Check if it matches the current view
            if (window.matchMedia(rule.conditionText).matches) {
              // Iterate through the rules inside the media rule
              for (const innerRule of rule.cssRules) {
                // Check if the rule applies to the :root selector
                if (innerRule.selectorText === ':root') {
                  // Get the value of the variable
                  const value = innerRule.style.getPropertyValue(variableName)
                  if (value) {
                    values.push({
                      mediaQuery: rule.conditionText,
                      value: value.trim(),
                    })
                  }
                }
              }
            }
          }
        }
      }
      catch (err) {
        // Catch any errors (e.g., cross-origin issues)
        console.error(err)
      }
    }

    return values
  }

  // BREAKPOINTS
  function getBreakpoints() {
    const rootStyles = getComputedStyle(parent.document.documentElement)
    const rootVariables = getRootVariables()
    let properties = []

    // Iterate over CSS properties and filter out the breakpoint ones
    for (let i = 0; i < rootVariables.length; i++) {
      const propName = rootVariables[i]
      if (propName.startsWith('--breakpoint-')) {
        const value = Number.parseFloat(rootStyles.getPropertyValue(propName)) // Convert to number for sorting
        properties.push({
          name: propName.replace('--breakpoint-', ''), // Remove the prefix to get original name
          value,
          originalValue: rootStyles.getPropertyValue(propName).trim(), // Store the original value (with unit) for later use
        })
      }
    }

    // Sort properties by value
    properties.sort((a, b) => a.value - b.value)

    // Remove doubles
    properties = properties.filter((p, i) => properties.findIndex(p2 => p2.name === p.name) === i)

    return properties
  }

  function getRootVariables() {
    return Array.from(parent.document.styleSheets)
      .filter(
        sheet =>
          sheet.href === null || sheet.href.startsWith(window.location.origin),
      )
      .reduce(
        (acc, sheet) => (acc = [
          ...acc,
          ...Array.from(sheet.cssRules).reduce(
            (def, rule) => (def
                = rule.selectorText === ':root'
                ? [
                    ...def,
                    ...Array.from(rule.style).filter(name =>
                      name.startsWith('--'),
                    ),
                  ]
                : def),
            [],
          ),
        ]),
        [],
      )
  }

  result.showGrid = parent.document.querySelector('html').classList.contains('-show-grid')
  result.breakpoints = getBreakpoints()
  result.columnCounts = getMediaQueryValues('--column-count')
  result.columnGutters = getMediaQueryValues('--column-gutter')

  return result
}

const showGridLines = ref(true)
watch(showGridLines, () => {
  parent.document.body.classList[showGridLines.value ? 'add' : 'remove']('show-grid-lines')
})
</script>

<template>
  <div px8 py6>
    <NIconTitle
      class="mb-5 text-xl op75"
      icon="i-carbon-cursor-1"
      text="oneclick.dev"
    />
    <div grid="~ md:cols-2 gap-x-10 gap-y-3" max-w-300>
      <div flex="~ col gap-2">
        <h3 text-lg>
          Layout
        </h3>

        <NCard p4 flex="~ col gap-2">
          <NCheckbox v-model="showGridLines" n-primary>
            <span>
              Show Grid Lines
            </span>
          </NCheckbox>
          <div mx--2 my1 h-1px border="b base" op75 />
          <span>{{ screenWidth }}</span>
          <div mx--2 my1 h-1px border="b base" op75 />
          {{ layoutSettings }}
          <div mx--2 my1 h-1px border="b base" op75 />
          <table w-full>
            <thead border="b base" h-7>
              <tr>
                <th text-left>
                  Breakpoint
                </th>
                <th text-left>
                  Start at
                </th>
                <th text-left>
                  Columns
                </th>
                <th text-left>
                  Gap
                </th>
              </tr>
            </thead>
            <tr h-7>
              <td>
                <span mr1>default</span>
              </td>
              <td op50>
                0px
              </td>
              <td>4</td>
              <td>10px</td>
            </tr>
            <tr h-7>
              <td>
                <span mr1>xs</span>
                <NBadge
                  n="green"
                  title="Registered at runtime as a global component"
                  v-text="'active'"
                />
              </td>
              <td>320px</td>
              <td>4</td>
              <td>10px</td>
            </tr>
            <tr h-7>
              <td>
                <span mr1>sm</span>
              </td>
              <td>576px</td>
              <td>4</td>
              <td>10px</td>
            </tr>
            <tr h-7>
              <td>
                <span mr1>md</span>
              </td>
              <td>768px</td>
              <td>8</td>
              <td>10px</td>
            </tr>
            <tr h-7>
              <td>
                <span mr1>lg</span>
              </td>
              <td>992px</td>
              <td>12</td>
              <td>10px</td>
            </tr>
            <tr h-7>
              <td>
                <span mr1>xl</span>
              </td>
              <td>1200px</td>
              <td>12</td>
              <td>10px</td>
            </tr>
          </table>
        </NCard>
      </div>
      <div flex="~ col gap-2">
        <h3 text-lg>
          Routes (met search + ververs)
        </h3>

        <h3 text-lg>
          Products (met search + ververs)
        </h3>

        <h3 text-lg>
          Vrije blokken tester
        </h3>

        <h3>
          Content editen
        </h3>

        <p>
          1. Toggle hier editor<br>
          2. Alle editable velden worden gemarkeerd in DOM<br>
          3. Klik op editable veld om te editen<br>
          4. devtools opent met editor<br>
          5. Saven via oneclick.dev CMS
        </p>

        <h3 mt2 text-lg>
          Login
        </h3>
      </div>
    </div>
  </div>

  <HelpFab>
    <h2>Documentation</h2>

    <a href="https://oneclick.dev" target="_blank">
      <NButton icon="i-carbon-document" n="primary">
        oneclick.dev
      </NButton>
    </a>

    <h3>Credits</h3>
    &copy; {{ new Date().getFullYear() }} oneclick.dev
  </HelpFab>
</template>
