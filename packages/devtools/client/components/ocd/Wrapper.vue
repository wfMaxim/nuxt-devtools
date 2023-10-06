<template>
  <div px8 py6>
    <NIconTitle
      class="mb-5 text-xl op75"
      icon="i-carbon-cursor-1"
      text="oneclick.dev"
    />
    <div grid="~ md:cols-2 gap-x-10 gap-y-3" max-w-300>
      <div flex="~ col gap-2">
        <ocd-layout />
        <ocd-fonts />
      </div>

      <ocd-building-blocks />
    </div>
  </div>

  <ocd-settings />
</template>
