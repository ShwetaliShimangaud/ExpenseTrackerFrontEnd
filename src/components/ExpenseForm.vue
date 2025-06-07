<template>
  <div class="form-container">
    <h2 class="title">Add Expense</h2>
    <form @submit.prevent="addExpense" class="form">
      <div class="input-group">
        <input
          v-model="description"
          placeholder="Description (e.g., groceries)"
          required
          :class="{ 'input-error': errors.description }"
          :title="errors.description || ''"
          @input="errors.description = null"
          class="input"
        />
      </div>
      <div class="input-group">
        <input
          v-model.number="amount"
          type="number"
          placeholder="Amount"
          required
          @focus="handleAmountFocus"
          @blur="handleAmountBlur"
          :class="{ 'input-error': errors.amount }"
          :title="errors.amount || ''"
          @input="errors.amount = null"
          class="input"
        />
      </div>
      <div class="input-group">
        <input
          v-model="date"
          type="date"
          required
          :class="{ 'input-error': errors.date }"
          :title="errors.date || ''"
          @input="errors.date = null"
          class="input"
        />
      </div>
      <button type="submit" class="button">Add Expense</button>
      <div v-if="errors.general" class="error-message">{{ errors.general }}</div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      description: '',
      amount: 0,
      date: '',
      errors: {}
    };
  },
  methods: {
    handleAmountFocus() {
      if (this.amount === 0) this.amount = null;
    },
    handleAmountBlur() {
      if (this.amount === null || this.amount === '') this.amount = 0;
    },
    addExpense() {
      const auth = localStorage.getItem('auth');
      axios.post('http://localhost:8080/api/expenses', {
        description: this.description,
        amount: this.amount,
        date: this.date
      }, {
        headers: { 'Authorization': `Basic ${auth}` }
      })
      .then(() => {
        this.$emit('expense-added');
        this.description = '';
        this.amount = 0;
        this.date = '';
        this.errors = {};
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          this.errors = error.response.data || {};
        } else {
          this.errors = { general: 'Something went wrong. Please try again.' };
        }
      });
    }
  }
};
</script>

<style scoped>
.form-container {
  background-color: #fff;
}

.title {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input {
  padding: 12px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.input:focus {
  border-color: #3498db;
  outline: none;
}

.input-error {
  border-color: #e74c3c;
  box-shadow: 0 0 5px rgba(231, 76, 60, 0.5);
}

.button {
  padding: 12px;
  font-size: 1.1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #2980b9;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  font-size: 1rem;
}
</style>