<script setup lang="ts">
// BUILDING BLOCKS
const components = useComponents()
// const client = useClient()

const componentGroups = [
  {
    name: 'Hybrid',
    path: 'hybrid',
    icon: 'carbon-nominal',
  },
  {
    name: 'Layout',
    path: 'layout',
    icon: 'carbon-template',
  },
  {
    name: 'Content',
    path: 'content',
    icon: 'carbon-document',
  },
]

// function test(component) {
//   // eslint-disable-next-line no-console
//   console.log('component clicked: ', component)
//   // eslint-disable-next-line no-console
//   console.log('all components', client.value?.nuxt?.vueApp._context.components)
// }
</script>

<template>
  <div flex="~ col gap-2">
    <h3 v-if="components?.filter(c => c.shortPath?.indexOf('components/building-blocks') > -1).length" text-lg>
      Building Block Components
    </h3>

    <template v-for="group in componentGroups" :key="group.name">
      <NSectionBlock
        v-if="components?.filter(c => c.shortPath?.indexOf(`components/building-blocks/${group.path}`) > -1).length"
        :icon="group.icon"
        :text="`${group.name} components`"
        :open="false"
        :description="`Total components: ${components?.filter(c => c.shortPath?.indexOf(`components/building-blocks/${group.path}`) > -1).length}`"
      >
        <div
          v-for="c of components?.filter(c => c.shortPath?.indexOf(`components/building-blocks/${group.path}`) > -1)?.map(c => ({ component: { ...c, pascalName: c.pascalName?.substr(2, c.pascalName?.length - 2) } }))"
          :key="c.component.filePath"
        >
          <ComponentItem
            v-bind="c"
          />
          <!-- <button @click="test(c)">
            test
          </button> -->
        </div>
      </NSectionBlock>
    </template>
  </div>
</template>
