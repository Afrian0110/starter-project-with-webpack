import RegisterPage from './register/register-page.js';
import LoginPage from './login/login-page.js';
import HomePage from './home/home-page.js';
import AddStoryPage from './add-story/add-story-page.js';
import DetailStoryPage from './detail-story/detail-story-page.js';
import NotFoundPage from './not-found/not-found.js';

class App {
  constructor({ content, drawerButton, navigationDrawer }) {
    this.content = content;
    this.drawerButton = drawerButton;
    this.navigationDrawer = navigationDrawer;

    // Define routes
    this.routes = {
      '/register': RegisterPage,
      '/login': LoginPage,
      '/home': HomePage,
      '/add-story': AddStoryPage,
      '/detail-story': DetailStoryPage,
    };

    this._initialListener();
    this._setupSkipLink();
  }

  _initialListener() {
    if (this.drawerButton && this.navigationDrawer) {
      this.drawerButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.navigationDrawer.classList.toggle('open');
      });

      window.addEventListener('click', () => {
        this.navigationDrawer.classList.remove('open');
      });
    }
  }

  _setupSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.getElementById('main-content');
      mainContent?.focus();
    });
  }

  _parseLocation() {
    const hash = location.hash.slice(1).toLowerCase() || '/login';
    const [_, mainRoute, id] = hash.split('/');
    return {
      route: `/${mainRoute || 'login'}`,
      id: id || null,
    };
  }

  async renderPage() {
    if (document.startViewTransition) {
      await document.startViewTransition(() => this._renderContent());
    } else {
      await this._renderContent();
    }
  }

  async _renderContent() {
    const { route, id } = this._parseLocation();
    const Page = this.routes[route] || NotFoundPage;

    let rendered = null;

    try {
      if (id) {
        rendered = await Page.render(id);
      }
      if (!rendered) {
        rendered = await Page.render();
      }
    } catch (err) {
      console.error('Render error:', err);
      rendered = '<p>Error while loading the page.</p>';
    }

    this.content.innerHTML = rendered;

    if (Page.afterRender) {
      try {
        await Page.afterRender(id);
      } catch (err) {
        console.error('After render error:', err);
      }
    }
  }
}

export default App;
