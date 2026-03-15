/* ====================================
   PromptGallery — Admin Login Page
   ==================================== */

const AdminLoginPage = {
  render() {
    const app = document.getElementById('app');
    
    // If already logged in, redirect to dashboard
    if (FireDB.isLoggedIn()) {
      Router.navigate('/admin/dashboard');
      return;
    }

    app.innerHTML = `
      ${Header.render()}
      <main class="page-content admin-login">
        <div class="login-card animate-fade-in">
          <h1>Admin Login</h1>
          <p>Sign in to manage your assets.</p>
          
          <form id="loginForm">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" id="loginEmail" placeholder="admin@example.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" id="loginPassword" placeholder="••••••••" required>
            </div>
            <div id="loginError" style="color:var(--color-error);font-size:var(--font-size-sm);margin-bottom:var(--space-md);display:none;"></div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%" id="loginBtn">Sign In</button>
          </form>
        </div>
      </main>
    `;
    Header.init();

    // Form handler
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const errorEl = document.getElementById('loginError');
      const btn = document.getElementById('loginBtn');
      
      btn.textContent = 'Signing in...';
      btn.disabled = true;
      errorEl.style.display = 'none';

      try {
        await FireDB.login(email, password);
        Router.navigate('/admin/dashboard');
      } catch (err) {
        errorEl.textContent = 'Invalid email or password. Please try again.';
        errorEl.style.display = 'block';
        btn.textContent = 'Sign In';
        btn.disabled = false;
      }
    });
  }
};
