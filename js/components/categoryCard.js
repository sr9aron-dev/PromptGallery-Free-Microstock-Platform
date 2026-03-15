/* ====================================
   PromptGallery — Category Card Component
   ==================================== */

const CategoryCard = {
  /**
   * Category cover images using Picsum (reliable, no API key)
   * Each ID maps to a specific consistent image
   */
  covers: {
    animals:      'https://picsum.photos/seed/animals/400/250',
    architecture: 'https://picsum.photos/seed/architecture/400/250',
    business:     'https://picsum.photos/seed/business/400/250',
    food:         'https://picsum.photos/seed/food/400/250',
    nature:       'https://picsum.photos/seed/nature/400/250',
    people:       'https://picsum.photos/seed/people/400/250',
    technology:   'https://picsum.photos/seed/technology/400/250',
    backgrounds:  'https://picsum.photos/seed/backgrounds/400/250',
    objects:      'https://picsum.photos/seed/objects/400/250',
    travel:       'https://picsum.photos/seed/travel/400/250',
    lifestyle:    'https://picsum.photos/seed/lifestyle/400/250',
    abstract:     'https://picsum.photos/seed/abstract/400/250',
    education:    'https://picsum.photos/seed/education/400/250',
    health:       'https://picsum.photos/seed/health/400/250',
    sports:       'https://picsum.photos/seed/sports/400/250',
    industry:     'https://picsum.photos/seed/industry/400/250',
    environment:  'https://picsum.photos/seed/environment/400/250',
  },

  /**
   * Gradient fallback colors per category (if image fails to load)
   */
  gradients: {
    animals:      'linear-gradient(135deg, #6C5CE7, #a29bfe)',
    architecture: 'linear-gradient(135deg, #00b894, #55efc4)',
    business:     'linear-gradient(135deg, #0984e3, #74b9ff)',
    food:         'linear-gradient(135deg, #e17055, #fab1a0)',
    nature:       'linear-gradient(135deg, #00b894, #81ecec)',
    people:       'linear-gradient(135deg, #fd79a8, #e84393)',
    technology:   'linear-gradient(135deg, #636e72, #b2bec3)',
    backgrounds:  'linear-gradient(135deg, #a29bfe, #6c5ce7)',
    objects:      'linear-gradient(135deg, #fdcb6e, #f39c12)',
    travel:       'linear-gradient(135deg, #00cec9, #81ecec)',
    lifestyle:    'linear-gradient(135deg, #fab1a0, #e17055)',
    abstract:     'linear-gradient(135deg, #e84393, #fd79a8)',
    education:    'linear-gradient(135deg, #0984e3, #74b9ff)',
    health:       'linear-gradient(135deg, #00b894, #55efc4)',
    sports:       'linear-gradient(135deg, #fdcb6e, #e17055)',
    industry:     'linear-gradient(135deg, #636e72, #2d3436)',
    environment:  'linear-gradient(135deg, #00b894, #00cec9)',
  },

  /**
   * SVG icons per category
   */
  icons: {
    animals: 'activity', architecture: 'grid', business: 'folder', food: 'heart',
    nature: 'image', people: 'users', technology: 'settings', backgrounds: 'image',
    objects: 'box', travel: 'map', lifestyle: 'smile', abstract: 'layout',
    education: 'book', health: 'activity', sports: 'target', industry: 'tool',
    environment: 'globe',
  },

  render(category) {
    const name = category.name || category;
    const slug = category.slug || Helpers.generateSlug(name);
    const img = this.covers[slug] || this.covers.nature;
    const gradient = this.gradients[slug] || this.gradients.nature;
    // Map standard ones to existing icons
    let iconName = 'folder';
    if(slug === 'people') iconName = 'user';
    if(slug === 'nature' || slug === 'backgrounds') iconName = 'image';
    if(slug === 'technology') iconName = 'settings';
    if(slug === 'business') iconName = 'folder';
    if(slug === 'animals' || slug === 'health') iconName = 'heart';
    
    // Fallback to something
    const iconHtml = Helpers.icon(iconName, 24);

    const count = category.count || '';

    return `
    <div class="category-card" onclick="Router.navigate('/category/${slug}')">
      <img src="${img}" alt="${name}" loading="lazy"
           onerror="this.style.display='none';this.parentElement.querySelector('.cat-fallback').style.display='flex';">
      <div class="cat-fallback" style="display:none;position:absolute;inset:0;background:${gradient};align-items:center;justify-content:center;color:white;">
        ${iconHtml}
      </div>
      <div class="category-card-label">
        <h3 style="display:flex;align-items:center;gap:8px;">${iconHtml} ${name}</h3>
        <span data-cat-count="${slug}">${count ? `${count} assets` : ''}</span>
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
