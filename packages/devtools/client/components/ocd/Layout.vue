<script setup lang="ts">
// LAYOUT
const screenWidth = ref(parent.window.innerWidth)
parent.addEventListener('resize', () => {
  screenWidth.value = parent.window.innerWidth
})

const layoutSettings = readWebsiteLayoutSettings()

function readWebsiteLayoutSettings() {
  const result = {}

  function getMediaQueryValues(variableName) {
    const values = []

    // Iterate through all the stylesheets
    for (const sheet of parent.document.styleSheets) {
      try {
        // Iterate through the rules inside each stylesheet
        for (const rule of sheet.cssRules) {
          // Check if the rule is a media rule
          if (rule.type === CSSRule.MEDIA_RULE) {
            // Check if it matches the current view
            if (parent.window.matchMedia(rule.conditionText).matches) {
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

  function summarizeValues(data) {
    const sortMediaQueries = (a, b) => {
      const minWidthA = Number.parseInt(a.mediaQuery.match(/\d+/)[0])
      const minWidthB = Number.parseInt(b.mediaQuery.match(/\d+/)[0])
      return minWidthA - minWidthB
    }

    data = data.sort(sortMediaQueries)

    const values = []
    let previousValue = ''
    for (const item of data) {
      if (item.value !== previousValue) {
        previousValue = item.value
        values.push({
          breakpoint: Number.parseFloat(item.mediaQuery.match(/\d+/)[0]),
          value: item.value,
        })
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

  result.breakpoints = getBreakpoints()
  result.columnCounts = summarizeValues(getMediaQueryValues('--column-count'))
  result.columnGutters = summarizeValues(getMediaQueryValues('--column-gutter'))
  result.columnOffsets = summarizeValues(getMediaQueryValues('--grid-offset'))
  result.maxWidthGrid = getComputedStyle(parent.document.querySelector(':root')).getPropertyValue('--grid-max-width')

  return result
}

function getMediaQueryValue(bp, variableName) {
  let val

  for (const item of layoutSettings[variableName]) {
    if (bp >= item.breakpoint)
      val = item.value
  }

  return val
}

const showGridLines = ref(parent.document.querySelector('html')?.classList?.contains('-show-grid') || false)
watch(showGridLines, () => {
  parent.document.querySelector('html').classList[showGridLines.value ? 'add' : 'remove']('-show-grid')
})
</script>

<template>
  <div mb-2>
    <h3 text-lg>
      Layout
    </h3>

    <NCard p4 flex="~ col gap-2">
      <NCheckbox v-model="showGridLines" n-primary>
        <span>Show Grid Lines</span>
      </NCheckbox>

      <div mx--2 my1 h-1px border="b base" op75 />

      <table class="mediaquery-table" w-full>
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
            <th text-left>
              Offset
            </th>
          </tr>
        </thead>
        <tr
          v-for="(bp, i) in layoutSettings?.breakpoints"
          :key="bp.name"
          :class="{ active: (i === 0 && screenWidth > bp.value && screenWidth < layoutSettings.breakpoints[i + 1].value)
            || (i === layoutSettings.breakpoints.length - 1 && screenWidth >= bp.value)
            || (screenWidth >= bp.value && screenWidth < layoutSettings.breakpoints[i + 1].value) }"
          h-7
        >
          <td>
            <span mr1>{{ bp.name }}</span>
            <NBadge
              n="green"
              title="Registered at runtime as a global component"
              class="active-badge"
              v-text="'active'"
            />
          </td>
          <td>
            {{ bp.originalValue }}
          </td>
          <td>{{ getMediaQueryValue(bp.value, 'columnCounts') }}</td>
          <td>{{ getMediaQueryValue(bp.value, 'columnGutters') }}</td>
          <td>{{ getMediaQueryValue(bp.value, 'columnOffsets') }}</td>
        </tr>
      </table>

      <div mx--2 my1 h-1px border="b base" op75 />

      <h3>Max width grid: <b>{{ layoutSettings?.maxWidthGrid }}</b></h3>
    </NCard>
  </div>
</template>

<style scoped>
.mediaquery-table tr {
  opacity: .5;
}

.mediaquery-table tr .active-badge {
  display: none;
}

.mediaquery-table tr.active {
  background-color: rgba(0, 220, 130, 0.1);
  opacity: 1;
}
.mediaquery-table tr.active .active-badge {
  display: inline;
}
</style>
