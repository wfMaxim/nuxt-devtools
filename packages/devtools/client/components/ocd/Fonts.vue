<script setup lang="ts">
import { ref } from 'vue'

const headingFontStyles = ref(getHeadingFontStyles())

// parent.addEventListener('resize', () => {
//   headingFontStyles.value = ref(getHeadingFontStyles())
// })

function getHeadingFontStyles() {
  const headingStyles = {};

  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag) => {
    const heading = document.createElement(tag)
    parent.window.document.body.appendChild(heading)

    headingStyles[tag] = {
      font: getComputedStyle(heading).font,
      letterSpacing: getComputedStyle(heading).letterSpacing,
    }

    parent.window.document.body.removeChild(heading)
  })

  return headingStyles
}
</script>

<template>
  <div flex="~ col gap-2">
    <h3 text-lg>
      Fonts
    </h3>

    <NCard p4 flex="~ col gap-2">
      <h1 :style="`font: ${headingFontStyles.h1.font}; letter-spacing: ${headingFontStyles.h1.letterSpacing};`">
        Heading 1
      </h1>
      <h2 :style="`font: ${headingFontStyles.h2.font}; letter-spacing: ${headingFontStyles.h2.letterSpacing};`">
        Heading 2
      </h2>
      <h3 :style="`font: ${headingFontStyles.h3.font}; letter-spacing: ${headingFontStyles.h3.letterSpacing};`">
        Heading 3
      </h3>
      <h4 :style="`font: ${headingFontStyles.h4.font}; letter-spacing: ${headingFontStyles.h4.letterSpacing};`">
        Heading 4
      </h4>
      <h5 :style="`font: ${headingFontStyles.h5.font}; letter-spacing: ${headingFontStyles.h5.letterSpacing};`">
        Heading 5
      </h5>
      <h6 :style="`font: ${headingFontStyles.h6.font}; letter-spacing: ${headingFontStyles.h6.letterSpacing};`">
        Heading 6
      </h6>

      <div mx--2 my1 h-1px border="b base" op75 />
    </NCard>
  </div>
</template>
