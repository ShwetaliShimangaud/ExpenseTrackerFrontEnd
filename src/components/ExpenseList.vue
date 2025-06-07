<template>
  <div class="main-container">
    <!-- Toggle between Active and Archived -->
    <div class="toggle-container">
      <label class="toggle-switch">
        <input type="checkbox" v-model="showArchived" @change="fetchExpenses(true)">
        <span class="slider">
          <span class="toggle-label toggle-label-left">Active</span>
          <span class="toggle-label toggle-label-right">Archived</span>
        </span>
      </label>
    </div>

    <!-- Filter Controls -->
    <div class="filter-container">
      <div class="filter-grid">
        <div class="filter-item">
          <label>Description</label>
          <input v-model="filters.description" placeholder="e.g. groceries" @input="fetchExpenses(true)" class="input" />
        </div>
        <div class="filter-item">
          <label>Min Amount</label>
          <input v-model.number="filters.minAmount" type="number" placeholder="Min" @input="fetchExpenses(true)" class="input" />
        </div>
        <div class="filter-item">
          <label>Max Amount</label>
          <input v-model.number="filters.maxAmount" type="number" placeholder="Max" @input="fetchExpenses(true)" class="input" />
        </div>
        <div class="filter-item">
          <label>Start Date</label>
          <input v-model="filters.startDate" type="date" @change="fetchExpenses(true)" class="input" />
        </div>
        <div class="filter-item">
          <label>End Date</label>
          <input v-model="filters.endDate" type="date" @change="fetchExpenses(true)" class="input" />
        </div>
      </div>
    </div>

    <!-- Scrollable Table Container -->
    <div class="table-container">
      <table class="expense-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
            <th v-if="!showArchived">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="expense in expenses" :key="expense.id" class="expense-row">
            <td>{{ expense.description }}</td>
            <td>${{ expense.amount }}</td>
            <td>{{ expense.date }}</td>
            <td v-if="!showArchived">
              <button @click="deleteExpense(expense.id)" class="delete-button">Archive</button>
            </td>
          </tr>
          <tr v-if="expenses.length === 0">
            <td :colspan="showArchived ? 3 : 4" class="no-data">
              {{ showArchived ? 'No archived expenses found.' : 'No expenses found.' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button
        :disabled="pagination.page <= 1 || pagination.totalPages === 0"
        @click="changePage(pagination.page - 1)"
        class="pagination-button"
      >Previous</button>
      <span class="pagination-info">
        Page {{ pagination.totalPages === 0 ? 0 : pagination.page }} of {{ pagination.totalPages }}
      </span>
      <button
        :disabled="pagination.page + 1 > pagination.totalPages || pagination.totalPages === 0"
        @click="changePage(pagination.page + 1)"
        class="pagination-button"
      >Next</button>
      <select v-model.number="pagination.perPage" @change="fetchExpenses(true)" class="per-page">
        <option :value="5">5 per page</option>
        <option :value="10">10 per page</option>
        <option :value="20">20 per page</option>
      </select>
    </div>

    <!-- Bottom Right Buttons -->
    <div class="bottom-buttons">
      <button v-if="!showArchived" @click="openAddExpenseModal" class="add-button">Add Expense</button>
      <button @click="logout" class="logout-button">Logout</button>
    </div>

    <!-- Add Expense Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <button @click="closeModal" class="close-button">×</button>
        <expense-form @expense-added="handleExpenseAdded" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ExpenseForm from './ExpenseForm.vue';

export default {
  components: { ExpenseForm },
  data() {
    return {
      expenses: [],
      filters: {
        description: '',
        startDate: '',
        endDate: '',
        minAmount: '',
        maxAmount: ''
      },
      pagination: {
        page: 1,
        perPage: 10,
        totalPages: 0
      },
      showModal: false,
      showArchived: false
    };
  },
  mounted() {
    this.fetchExpenses();
  },
  methods: {
    fetchExpenses(resetPage = false) {
      const auth = localStorage.getItem('auth');
      if (!auth) {
        this.$router.push('/');
        return;
      }

      if (resetPage) this.pagination.page = 1;

      const url = this.showArchived 
        ? 'http://localhost:8080/api/expenses/archived'
        : 'http://localhost:8080/api/expenses';

      const params = {
        description: this.filters.description || undefined,
        startDate: this.filters.startDate || undefined,
        endDate: this.filters.endDate || undefined,
        minAmount: this.filters.minAmount || undefined,
        maxAmount: this.filters.maxAmount || undefined,
        page: this.pagination.page - 1,
        size: this.pagination.perPage
      };

      axios.get(url, {
        headers: { 'Authorization': `Basic ${auth}` },
        params
      })
      .then(response => {
        this.expenses = response.data.content;
        this.pagination.totalPages = response.data.totalPages;
      })
      .catch(() => this.$router.push('/'));
    },
    deleteExpense(id) {
      const auth = localStorage.getItem('auth');
      axios.delete(`http://localhost:8080/api/expenses/${id}`, {
        headers: { 'Authorization': `Basic ${auth}` }
      })
      .then(() => this.fetchExpenses());
    },
    changePage(newPage) {
      if (newPage < 1 || newPage > this.pagination.totalPages) return;
      this.pagination.page = newPage;
      this.fetchExpenses();
    },
    logout() {
      localStorage.removeItem('auth');
      this.$router.push('/');
    },
    openAddExpenseModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    handleExpenseAdded() {
      this.fetchExpenses();
      this.closeModal();
    }
  }
};
</script>

<style scoped>
.main-container {
  padding: 40px;
  background-color: #ecf0f1;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
  position: relative;
}

.toggle-container {
  max-width: 1200px;
  margin: 0 auto 20px;
  display: flex;
  justify-content: center;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 240px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 34px;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 118px;
  left: 4px;
  bottom: 4px;
  background-color: #3498db;
  border-radius: 34px;
  transition: transform 0.3s ease;
}

input:checked + .slider:before {
  transform: translateX(114px);
}

input:checked + .slider .toggle-label-left {
  color: #2c3e50;
}

input:checked + .slider .toggle-label-right {
  color: white;
}

input:not(:checked) + .slider .toggle-label-left {
  color: white;
}

input:not(:checked) + .slider .toggle-label-right {
  color: #2c3e50;
}

.toggle-label {
  font-size: 1rem;
  z-index: 1;
}

.toggle-label-left {
  margin-left: 10px;
}

.toggle-label-right {
  margin-right: 10px;
}

.filter-container {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  position: sticky;
  top: 40px;
  z-index: 10;
}

.filter-grid {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.filter-item {
  display: flex;
  flex-direction: column;
  width: 150px;
}

.filter-item label {
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.input {
  padding: 10px;
  font-size: 0.9rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.input:focus {
  border-color: #3498db;
  outline: none;
}

.table-container {
  max-width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 300px);
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

.expense-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  table-layout: fixed;
}

.expense-table th,
.expense-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.expense-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #2c3e50;
  position: sticky;
  top: 0;
  z-index: 5;
}

.expense-table th:nth-child(1),
.expense-table td:nth-child(1) {
  width: 40%;
}

.expense-table th:nth-child(2),
.expense-table td:nth-child(2) {
  width: 20%;
}

.expense-table th:nth-child(3),
.expense-table td:nth-child(3) {
  width: 20%;
}

.expense-table th:nth-child(4),
.expense-table td:nth-child(4) {
  width: 20%;
}

.delete-button {
  padding: 8px 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #c0392b;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
}

.pagination {
  max-width: 1200px;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  position: sticky;
  bottom: 80px;
  background: #ecf0f1;
  padding: 10px;
  z-index: 10;
}

.pagination-button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  background-color: #2980b9;
}

.pagination-info {
  font-size: 1rem;
  color: #7f8c8d;
}

.per-page {
  padding: 8px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
}

.bottom-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 15px;
  z-index: 10;
}

.logout-button,
.add-button {
  padding: 12px 24px;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button {
  background-color: #e74c3c;
  color: white;
}

.logout-button:hover {
  background-color: #c0392b;
}

.add-button {
  background-color: #2ecc71;
  color: white;
}

.add-button:hover {
  background-color: #27ae60;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
}
</style>