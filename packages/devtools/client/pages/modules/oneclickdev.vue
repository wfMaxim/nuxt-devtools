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
</script>

<template>
  <ocd-wrapper />
</template>
