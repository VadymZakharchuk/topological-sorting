import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import ExecutionPlanner from './ExecutionPlanner.vue';
import * as scriptPlanner from '@/utils/scriptPlanner';

describe('ExecutionPlanner.vue', () => {
  it('should display the execution plan and warnings after clicking the button', async () => {
    // 1. Mock the createExecutionPlan function
    vi.spyOn(scriptPlanner, 'createExecutionPlan').mockReturnValue({
      waves: [[1, 2], [3]],
      warnings: ['Mock warning 1'],
      efficiency: 0.5,
    });

    // 2. Mount the component
    const wrapper = mount(ExecutionPlanner);

    // 3. Verify that the plan and warnings are not visible initially
    expect(wrapper.find('h2').text()).toContain('Enter scripts');
    expect(wrapper.find('li').exists()).toBe(false);

    // 4. Simulate a user click on the "Generate plan" button
    const button = wrapper.find('button');
    await button.trigger('click');

    // 5. Verify that the plan, statistics, and warnings are now visible
    expect(wrapper.find('h3').text()).toContain('Execution plan');
    expect(wrapper.findAll('li')).toHaveLength(1);
    expect(wrapper.find('li').text()).toContain('Mock warning 1');
  });
});
