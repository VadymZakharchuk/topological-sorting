import type { ExecutionPlan, VulnerabilityScript } from '@/types/scriptPlanner.types.ts'

export const createExecutionPlan = (
  scripts: VulnerabilityScript[]
): ExecutionPlan => {
  const waves: number[][] = [];
  const warnings: string[] = [];

  // Step 1: Handling missing dependencies
  const scriptMap = new Map<number, VulnerabilityScript>();
  scripts.forEach((script) => scriptMap.set(script.scriptId, script));

  scripts.forEach((script) => {
    script.dependencies.forEach((depId) => {
      if (!scriptMap.has(depId)) {
        warnings.push(
          `Script ${script.scriptId} depends on a missing script ${depId}`
        );
      }
    });
  });

  // Step 2: Graph construction and in-degree calculation (count of dependencies)
  const inDegree = new Map<number, number>();
  const graph = new Map<number, number[]>();

  scripts.forEach((script) => {
    inDegree.set(script.scriptId, script.dependencies.length);
    if (!graph.has(script.scriptId)) {
      graph.set(script.scriptId, []);
    }
  });

  scripts.forEach((script) => {
    script.dependencies.forEach((depId) => {
      if (graph.has(depId)) {
        const dependentScripts = graph.get(depId);
        if (dependentScripts) {
          dependentScripts.push(script.scriptId);
        }
      }
    });
  });

  // Step 3: Initialize the first wave
  let currentWave: number[] = [];
  inDegree.forEach((degree, scriptId) => {
    if (degree === 0) {
      currentWave.push(scriptId);
    }
  });

  // Step 4: Wave Formation
  let processedScriptsCount = 0;
  while (currentWave.length > 0) {
    waves.push(currentWave);
    processedScriptsCount += currentWave.length;

    const nextWave: number[] = [];
    currentWave.forEach((scriptId) => {
      const dependentScripts = graph.get(scriptId) || [];
      dependentScripts.forEach((dependentId) => {
        const currentDegree = inDegree.get(dependentId);
        if (currentDegree !== undefined) {
          inDegree.set(dependentId, currentDegree - 1);
          if (currentDegree - 1 === 0) {
            nextWave.push(dependentId);
          }
        }
      });
    });
    currentWave = nextWave;
  }

  // Step 5: Efficiency calculation
  const totalScripts = scripts.length;
  const totalWaves = waves.length;
  if (processedScriptsCount !== totalScripts) {
    warnings.push('Error: Not all scripts were included in the execution plan due to missing or circular dependencies.');
  }
  const efficiency = totalWaves > 0 ? totalScripts / totalWaves : 0;

  return {
    waves,
    warnings,
    efficiency,
  };
};
