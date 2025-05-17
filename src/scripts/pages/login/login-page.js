import LoginPresenter from '../../presenter/login-presenter.js';

const LoginPage = {
  render() {
    return /*html*/`
      <main>
        <h2 style="text-align: center; margin-bottom: 1rem;">Login</h2>
        <form id="login-form" aria-label="Login form">
          <div>
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>

          <div>
            <label for="password">Password</label>
            <input id="password" name="password" type="password" required />
          </div>

          <button type="submit">Login</button>
        </form>

        <p style="text-align: center; margin-top: 1rem;">
          Belum punya akun? 
          <a href="#/register" aria-label="Go to register page">Register di sini</a>
        </p>
      </main>
    `;
  },

  afterRender() {
    const form = document.getElementById('login-form');
    LoginPresenter.init(form);
  }
};

export default LoginPage;
