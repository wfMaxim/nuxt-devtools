<script setup lang="ts">
function getHeadingFontStyles() {
  const headingStyles = {};

  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag) => {
    const heading = document.createElement(tag)
    document.body.appendChild(heading)
    headingStyles[tag] = getComputedStyle(heading).font
    document.body.removeChild(heading)
  })

  return headingStyles
}

const headingFontStyles = ref(getHeadingFontStyles())
</script>

<template>
  <div flex="~ col gap-2">
    <h3 text-lg>
      Fonts
    </h3>

    <NCard p4 flex="~ col gap-2">
      <h1 :style="`font: ${headingFontStyles.h1}`">
        Heading 1
      </h1>
      <h2 :style="`font: ${headingFontStyles.h2}`">
        Heading 2
      </h2>
      <h3 :style="`font: ${headingFontStyles.h3}`">
        Heading 3
      </h3>
      <h4 :style="`font: ${headingFontStyles.h4}`">
        Heading 4
      </h4>
      <h5 :style="`font: ${headingFontStyles.h5}`">
        Heading 5
      </h5>
      <h6 :style="`font: ${headingFontStyles.h6}`">
        Heading 6
      </h6>
      <div mx--2 my1 h-1px border="b base" op75 />
    </NCard>
  </div>
</template>
