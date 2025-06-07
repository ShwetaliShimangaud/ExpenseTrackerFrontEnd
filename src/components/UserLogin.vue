<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">Welcome Back</h2>
      <p class="login-subtitle">Sign in to manage your expenses</p>
      <form @submit.prevent="login" class="login-form">
        <div class="input-group">
          <label for="username">Username</label>
          <input
            v-model="username"
            id="username"
            placeholder="Enter your username"
            required
            class="input"
          />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            class="input"
          />
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    login() {
      localStorage.removeItem('auth');
      const credentials = btoa(`${this.username}:${this.password}`);
      localStorage.setItem('auth', credentials);
      this.$router.push('/expenses');
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ecf0f1;
  font-family: 'Arial', sans-serif;
  padding: 20px;
}

.login-card {
  background: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.login-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.login-subtitle {
  font-size: 1rem;
  color: #7f8c8d;
  margin-bottom: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.input-group label {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.input {
  padding: 12px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input:focus {
  border-color: #3498db;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.2);
  outline: none;
}

.login-button {
  padding: 12px;
  font-size: 1.1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.login-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.login-button:active {
  transform: translateY(0);
}
</style>