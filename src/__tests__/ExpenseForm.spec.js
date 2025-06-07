import { mount } from '@vue/test-utils';
import axios from 'axios';
import ExpenseForm from '@/components/ExpenseForm.vue';
import { vi } from 'vitest';

vi.mock('axios');

describe('ExpenseForm.vue', () => {
  let wrapper;

  beforeEach(() => {
    const localStorageMock = {
      getItem: vi.fn(() => 'mocked-auth-token'),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    wrapper = mount(ExpenseForm, {
      global: {
        mocks: {
          $emit: vi.fn(),
        },
      },
    });
  });

  afterEach(() => {
    wrapper.destroy(); 
    vi.clearAllMocks();
  });

  it('emits expense-added event when form is submitted successfully', async () => {
    axios.post.mockResolvedValue({});

    await wrapper.find('input[placeholder="Description (e.g., groceries)"]').setValue('Groceries');
    await wrapper.find('input[type="number"]').setValue(50);
    await wrapper.find('input[type="date"]').setValue('2025-06-06');

    await wrapper.find('form').trigger('submit.prevent');

    await wrapper.vm.$nextTick();

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8080/api/expenses',
      {
        description: 'Groceries',
        amount: 50,
        date: '2025-06-06',
      },
      {
        headers: { Authorization: 'Basic mocked-auth-token' },
      }
    );

    expect(wrapper.emitted('expense-added')).toBeTruthy();
    expect(wrapper.emitted('expense-added').length).toBe(1);

    expect(wrapper.vm.description).toBe('');
    expect(wrapper.vm.amount).toBe(0);
    expect(wrapper.vm.date).toBe('');
    expect(wrapper.vm.errors).toEqual({});
  });
});