/// <reference types="vitest/globals" />
import {createExecutionPlan} from './scriptPlanner';

// Тестові дані для сценаріїв
const mockScripts = [
  { scriptId: 1, dependencies: [] },
  { scriptId: 2, dependencies: [1] },
  { scriptId: 3, dependencies: [1] },
  { scriptId: 4, dependencies: [2, 3] },
];

describe('createExecutionPlan', () => {
  // Тест 1: Базовий випадок з послідовними залежностями
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

  // Тест 2: Сценарій з кількома незалежними сценаріями
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

  // Тест 3: Сценарій з відсутньою залежністю
  test('should include a warning for a script with a missing dependency', () => {
    const scripts = [
      { scriptId: 1, dependencies: [] },
      { scriptId: 2, dependencies: [99] }, // 99 is missing
    ];
    const plan = createExecutionPlan(scripts);
    expect(plan.waves.length).toBe(1);
    expect(plan.waves[0]).toEqual([1]);
    expect(plan.warnings.length).toBe(2);
    expect(plan.warnings[0]).toContain('depends on a missing script 99');
  });

  // Тест 4: Сценарій з комплексним графом залежностей
  test('should handle a complex dependency graph correctly', () => {
    const scripts = mockScripts;
    const plan = createExecutionPlan(scripts);
    expect(plan.waves.length).toBe(3);
    expect(plan.waves[0]).toEqual([1]);
    expect(plan.waves[1]).toEqual(expect.arrayContaining([2, 3]));
    expect(plan.waves[2]).toEqual([4]);
    expect(plan.warnings.length).toBe(0);
  });

  // Тест 5: Порожній вхідний масив
  test('should return an empty plan for an empty script array', () => {
    const plan = createExecutionPlan([]);
    expect(plan.waves.length).toBe(0);
    expect(plan.warnings.length).toBe(0);
    expect(plan.efficiency).toBe(0);
  });

  // Тест 6: Ефективність
  test('should calculate efficiency correctly', () => {
    const plan = createExecutionPlan(mockScripts);
    expect(plan.efficiency).toBeCloseTo(1 / 3);
  });
});