/// <reference types="vitest/globals" />
import {createExecutionPlan} from './scriptPlanner';

// Test data for scenarios
const mockScripts = [
  { scriptId: 1, dependencies: [] },
  { scriptId: 2, dependencies: [1] },
  { scriptId: 3, dependencies: [1] },
  { scriptId: 4, dependencies: [2, 3] },
];

describe('createExecutionPlan', () => {
  // Test 1: Base case with sequential dependencies
  test('should correctly create an execution plan for a simple dependency graph', () => {
    const scripts = [
      { scriptId: 1, dependencies: [] },
      { scriptId: 2, dependencies: [1] },
      { scriptId: 3, dependencies: [2] },
    ];
    const plan = createExecutionPlan(scripts);
    expect(plan.waves.length).toBe(3);
    expect(plan.waves[0]).toEqual([1]);
    expect(plan.waves[1]).toEqual([2]);
    expect(plan.waves[2]).toEqual([3]);
    expect(plan.warnings.length).toBe(0);
  });

  // Test 2: Scenario with multiple independent scenarios
  test('should group independent scripts into the same wave', () => {
    const scripts = [
      { scriptId: 1, dependencies: [] },
      { scriptId: 2, dependencies: [] },
      { scriptId: 3, dependencies: [1, 2] },
    ];
    const plan = createExecutionPlan(scripts);
    expect(plan.waves.length).toBe(2);
    expect(plan.waves[0]).toEqual(expect.arrayContaining([1, 2]));
    expect(plan.waves[1]).toEqual([3]);
    expect(plan.warnings.length).toBe(0);
  });

  // Test 3: Scenario with missing dependency
  test('should include a warning for a script with a missing dependency', () => {
    const scripts = [
      { scriptId: 1, dependencies: [] },
      { scriptId: 2, dependencies: [99] },
    ];
    const plan = createExecutionPlan(scripts);
    expect(plan.waves.length).toBe(1);
    expect(plan.waves[0]).toEqual([1]);
    expect(plan.warnings.length).toBe(2);
    expect(plan.warnings[0]).toContain('depends on a missing script 99');
  });

  // Test 4: Scenario with a complex dependency graph
  test('should handle a complex dependency graph correctly', () => {
    const plan = createExecutionPlan(mockScripts);
    expect(plan.waves.length).toBe(3);
    expect(plan.waves[0]).toEqual([1]);
    expect(plan.waves[1]).toEqual(expect.arrayContaining([2, 3]));
    expect(plan.waves[2]).toEqual([4]);
    expect(plan.warnings.length).toBe(0);
  });

  // Test 5: Empty input array
  test('should return an empty plan for an empty script array', () => {
    const plan = createExecutionPlan([]);
    expect(plan.waves.length).toBe(0);
    expect(plan.warnings.length).toBe(0);
    expect(plan.efficiency).toBe(0);
  });

  // Test 6: Efficiency
  test('should calculate efficiency correctly', () => {
    const plan = createExecutionPlan(mockScripts);
    expect(plan.efficiency).toBeCloseTo(4 / 3);
  });
});
