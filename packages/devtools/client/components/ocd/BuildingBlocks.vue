<script setup lang="ts">
// BUILDING BLOCKS
const components = useComponents()
</script>

<template>
  <div flex="~ col gap-2">
    <h3 v-if="components?.filter(c => c.shortPath?.indexOf('components/building-blocks') > -1).length" text-lg>
      Building Block Components
    </h3>

    <NSectionBlock
      v-if="components?.filter(c => c.shortPath?.indexOf('components/building-blocks/hybrid') > -1).length"
      icon="carbon-nominal"
      text="Hybrid components"
      :open="false"
      :description="`Total components: ${components?.filter(c => c.shortPath?.indexOf('components/building-blocks/hybrid') > -1).length}`"
    >
      <ComponentItem
        v-for="c of components?.filter(c => c.shortPath?.indexOf('components/building-blocks/hybrid') > -1)?.map(c => ({ component: { ...c, pascalName: c.pascalName?.substr(2, c.pascalName?.length - 2) } }))"
        :key="c.component.filePath"
        v-bind="c"
      />
    </NSectionBlock>

    <NSectionBlock
      v-if="components?.filter(c => c.shortPath?.indexOf('components/building-blocks/layout') > -1).length"
      icon="carbon-template"
      text="Layout components"
      :open="false"
      :description="`Total components: ${components?.filter(c => c.shortPath?.indexOf('components/building-blocks/layout') > -1).length}`"
    >
      <ComponentItem
        v-for="c of components?.filter(c => c.shortPath?.indexOf('components/building-blocks/layout') > -1)?.map(c => ({ component: { ...c, pascalName: c.pascalName?.substr(2, c.pascalName?.length - 2) } }))"
        :key="c.component.filePath"
        v-bind="c"
      />
    </NSectionBlock>

    <NSectionBlock
      v-if="components?.filter(c => c.shortPath?.indexOf('components/building-blocks/content') > -1).length"
      icon="carbon-document"
      text="Content components"
      :open="false"
      :description="`Total components: ${components?.filter(c => c.shortPath?.indexOf('components/building-blocks/content') > -1).length}`"
    >
      <ComponentItem
        v-for="c of components?.filter(c => c.shortPath?.indexOf('components/building-blocks/content') > -1)?.map(c => ({ component: { ...c, pascalName: c.pascalName?.substr(2, c.pascalName?.length - 2) } }))"
        :key="c.component.filePath"
        v-bind="c"
      />
    </NSectionBlock>
  </div>
</template>
