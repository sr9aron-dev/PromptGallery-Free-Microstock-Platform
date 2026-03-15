/* ====================================
   PromptGallery — Category Card Component
   ==================================== */

const CategoryCard = {
  /**
   * Category cover images from Picsum (placeholder)
   */
  covers: {
    animals: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&h=250&fit=crop',
    architecture: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=250&fit=crop',
    business: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=250&fit=crop',
    nature: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=250&fit=crop',
    people: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=250&fit=crop',
    technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop',
    backgrounds: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=250&fit=crop',
    objects: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=250&fit=crop',
    travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop',
    lifestyle: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=250&fit=crop',
    abstract: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=250&fit=crop',
    education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop',
    health: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=250&fit=crop',
    sports: 'https://images.unsplash.com/photo-1461896836934-bd45ba8ab083?w=400&h=250&fit=crop',
    industry: 'https://images.unsplash.com/photo-1504917595217-d4dc5ede4c68?w=400&h=250&fit=crop',
    environment: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
  },

  render(category) {
    const name = category.name || category;
    const slug = category.slug || Helpers.generateSlug(name);
    const img = this.covers[slug] || this.covers.nature;
    const count = category.count || '';

    return `
    <div class="category-card" onclick="Router.navigate('/category/${slug}')">
      <img src="${img}" alt="${name}" loading="lazy">
      <div class="category-card-label">
        <h3>${name}</h3>
        ${count ? `<span>${count} assets</span>` : ''}
      </div>
    </div>`;
  },

  renderGrid(categories) {
    return `
    <div class="flex-grid flex-grid-4">
      ${categories.map(cat => this.render(cat)).join('')}
    </div>`;
  }
};
