const NotFound = {
  async render() {
    return `
      <div class="not-found">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <a href="/#/" class="btn">Back to Home</a>
      </div>
    `;
  },

  async afterRender() {
    // Add any additional logic here
  }
};

export default NotFound; 