<template>
  <div class="mx-auto p-8 w-[340px] md:w-[760px] bg-gray-50 rounded-lg shadow-lg flex flex-col min-h-fit gap-y-6">
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-800">
      Scenario execution scheduler
    </h1>

    <div class="mb-6 bg-white p-6 rounded-lg shadow-inner">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">
        Enter scripts (in JSON format)
      </h2>
      <textarea
        v-model="inputScripts"
        class="w-full h-48 p-3 text-sm font-mono border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Example:&#10;[&#10;  { &quot;scriptId&quot;: 1, &quot;dependencies&quot;: [] },&#10;  { &quot;scriptId&quot;: 2, &quot;dependencies&quot;: [1] }&#10;]&#10;"
      ></textarea>
      <button
        @click="generatePlan"
        class="mt-4 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out cursor-pointer"
      >
        Generate plan
      </button>
    </div>

    <div v-if="executionPlan" class="flex flex-col gap-y-6">
      <div v-if="executionPlan.waves.length > 0" class="h-fit">
        <h3 class="text-xl font-semibold mb-4 text-gray-700 mt-4 px-6">Execution plan</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div
            v-for="(wave, index) in executionPlan.waves"
            :key="index"
            class="bg-blue-100 p-4 rounded-lg shadow-md"
          >
            <h3 class="font-bold text-blue-900">
              Wave {{ index + 1 }}
              <span class="text-xs text-gray-500 ml-2"
              >({{ wave.length }} scenari{{
                  wave.length === 1 ? "o" : "os"
                }})</span
              >
            </h3>
            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="scriptId in wave"
                :key="scriptId"
                class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-mono"
              >
                ID {{ scriptId }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-2 text-gray-700 mt-4">Statistics</h3>
        <p class="text-gray-600">
          Total count of waves:
          <span class="font-bold text-blue-700">{{
              executionPlan.waves.length
            }}</span>
        </p>
        <p class="text-gray-600">
          Total count of scenarios:
          <span class="font-bold text-blue-700">{{ totalScripts }}</span>
        </p>
        <p class="text-gray-600">
          Efficiency:
          <span class="font-bold text-blue-700">{{
              (executionPlan.efficiency * 100).toFixed(2)
            }}%</span>
        </p>
      </div>
      <div v-if="executionPlan.warnings.length > 0" class="h-fit">
        <h2 class="text-xl font-semibold mb-2 text-red-600 pl-6">
          Warnings and errors
        </h2>
        <ul class="list-disc list-inside bg-red-100 p-4 rounded-lg shadow">
          <li
            v-for="(warning, index) in executionPlan.warnings"
            :key="index"
            class="text-red-800"
          >
            {{ warning }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { createExecutionPlan } from '@/utils/scriptPlanner.ts';
import type { VulnerabilityScript, ExecutionPlan } from '@/types/scriptPlanner.types.ts';

const inputScripts = ref<string>(
  JSON.stringify(
    [
      { scriptId: 1, dependencies: [] },
      { scriptId: 2, dependencies: [1] },
      { scriptId: 3, dependencies: [1, 2] },
      { scriptId: 4, dependencies: [99] },
    ],
    null,
    2
  )
);
const executionPlan = ref<ExecutionPlan | null>(null);
const parseError = ref<string | null>(null);

const totalScripts = computed(() => {
  try {
    const scripts: VulnerabilityScript[] = JSON.parse(inputScripts.value);
    return scripts.length;
  } catch (e) {
    console.error(e);
    return 0;
  }
});

const generatePlan = () => {
  try {
    const scripts: VulnerabilityScript[] = JSON.parse(inputScripts.value);
    executionPlan.value = createExecutionPlan(scripts);
    parseError.value = null;
  } catch (e: unknown) {
    let errorMessage = 'JSON parsing error';
    if (e instanceof Error) {
      errorMessage += ': ' + e.message;
    } else if (typeof e === 'string') {
      errorMessage += ': ' + e;
    }
    parseError.value = errorMessage;
    executionPlan.value = null;
  }
};
</script>
