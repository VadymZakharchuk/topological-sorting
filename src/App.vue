<template>
  <div class="w-full max-w-screen flex flex-col p-8 md:max-w-[1280px] md:mx-auto h-auto">
    <div class="wrapper">
      <ExecutionPlanner />
    </div>
  </div>
</template>

<script setup lang="ts">
import ExecutionPlanner from '@/components/ExecutionPlanner.vue'
</script>

<style scoped lang="scss">
.wrapper {
  @apply mx-auto h-[100%];
}
</style>
