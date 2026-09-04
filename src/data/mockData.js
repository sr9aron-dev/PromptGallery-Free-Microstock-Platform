/* ==========================================================================
   Storyboard Workspace — Initial Mock Data
   High-quality creative storyboard entries with rich prompts, descriptions & multi-shot media
   ========================================================================== */

export const DEFAULT_CATEGORIES = [
  'Cinematic',
  'Animation',
  'Sci-Fi',
  'Character',
  'Commercial',
  'Concept',
  'Cyberpunk',
  'Architecture'
];

// For backward compatibility
export const CATEGORIES = [
  'All',
  ...DEFAULT_CATEGORIES
];

export const FRONTIER_AI_MODELS = [
  'Flux.1 Dev',
  'Flux.1 Pro',
  'Midjourney v6.1',
  'OpenAI Sora v2',
  'Runway Gen-3 Alpha',
  'Kling AI v1.5',
  'Luma Dream Machine',
  'Ideogram v2',
  'Stable Diffusion 3.5 Large',
  'Hailuo AI / Minimax',
  'Niji v6'
];

export const INITIAL_STORYBOARDS = [
  {
    id: 'sb-admin-new-01',
    title: 'Cybernetic Genesis: Neural Infiltration Sequence',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1800&q=90',
    category: 'Cyberpunk',
    aspectRatio: '16:9',
    author: 'sr7aron@gmail.com',
    authorRole: 'admin',
    isNew: true,
    description: 'Postingan baru terverifikasi dari Admin (sr7aron@gmail.com). Adegan visual futuristik tingkat tinggi melacak agen otonom melalui saluran fiber Central Megastructure dengan pencahayaan neon volumetrik.',
    mediaItems: [
      {
        id: 'sb-new-m1',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1800&q=90',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
        type: 'image',
        caption: 'Shot 1: Master cinematic shot of neural infiltration agent crouched in glowing neon coolant duct'
      },
      {
        id: 'sb-new-m2',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1800&q=90',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
        type: 'image',
        caption: 'Shot 2: Close-up of ocular cybernetic sensor analyzing encrypted fiber strands'
      }
    ],
    prompt: 'Cinematic master shot of cybernetic infiltration agent crouched in glowing neon coolant duct, volumetric mist, iridescent fiber optics illuminating chrome chassis, raytraced reflection on polished carbon fiber, Hasselblad 80mm f/1.4, cinematic color grading, 8k.',
    createdAt: 'Baru Saja (Just Now)',
    parameters: { model: 'Flux.1 Pro', author: 'sr7aron@gmail.com (Admin)' }
  },
  {
    id: 'sb-01',
    title: 'Neon Odyssey: Cyberpunk Alley Sequence',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1800&q=90',
    category: 'Sci-Fi',
    aspectRatio: '16:9',
    author: 'sr7aron@gmail.com',
    authorRole: 'admin',
    description: 'A 3-shot neo-noir sequence exploring an atmospheric alleyway in 2088 Neo-Tokyo. A rogue android seeks shelter from toxic rain while surveillance drones sweep the perimeter with high-intensity ultraviolet scanners.',
    mediaItems: [
      {
        id: 'sb-01-m1',
        url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1800&q=90',
        thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80',
        type: 'image',
        caption: 'Shot 1: Wide establishing shot of rain-drenched alleyway with flickering magenta neon'
      },
      {
        id: 'sb-01-m2',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1800&q=90',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
        type: 'image',
        caption: 'Shot 2: Medium close-up of cybernetic ocular sensor adjusting in low light'
      },
      {
        id: 'sb-01-m3',
        url: 'https://images.unsplash.com/photo-1515260268569-9271009adfdb?auto=format&fit=crop&w=1800&q=90',
        thumbnailUrl: 'https://images.unsplash.com/photo-1515260268569-9271009adfdb?auto=format&fit=crop&w=900&q=80',
        type: 'image',
        caption: 'Shot 3: Low-angle puddle reflection showing holographic corporation logo'
      }
    ],
    prompt: 'Cinematic wide angle shot of a solitary rogue android standing in a neon-drenched rainy Tokyo alley, holographic advertisements flickering in deep indigo and magenta, volumetric fog, Kodak Portra 800 tone, hyper-realistic reflections on wet asphalt, octane render, 8k.',
    createdAt: 'Sep 4, 2026',
    parameters: { model: 'Flux.1 Dev', guidance: 4.5, seed: 938472 }
  },
  {
    id: 'sb-02',
    title: 'Celestial Drifter: Atmospheric Spaceship Descent',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'Cinematic',
    aspectRatio: '16:9',
    description: 'Long tracking cinematic shot of exploration vessel entering the dense turbulent upper atmosphere of a gas giant. Heat displacement waves ripple across the hull while orbital solar arrays retract.',
    mediaItems: [
      {
        id: 'sb-02-m1',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
        type: 'video',
        caption: 'Shot 1: 4K Anamorphic entry burn with superheated ion trail'
      },
      {
        id: 'sb-02-m2',
        url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1800&q=90',
        thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80',
        type: 'image',
        caption: 'Shot 2: High orbital vantage point showing planetary cloud vortex'
      }
    ],
    prompt: 'Slow tracking shot of an interstellar explorer vessel entering the turbulent orange cloud deck of a gas giant, heat shield glowing incandescent cherry red, cinematic anamorphic lens flares, IMAX 70mm grain, score pacing, master lighting, photorealistic VFX.',
    createdAt: 'Sep 3, 2026',
    parameters: { model: 'OpenAI Sora v2', fps: 24, duration: '6s' }
  },
  {
    id: 'sb-03',
    title: 'Arcane Botanica: Enchanted Glasshouse',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=900&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1800&q=90',
    category: 'Concept',
    aspectRatio: '16:9',
    description: 'An abandoned Victorian glass conservatory where magical botanical specimens have overgrown the ornate cast iron ribs. Luminous pollen grains drift lazily in shafts of golden afternoon sunlight.',
    mediaItems: [
      {
        id: 'sb-03-m1',
        url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1800&q=90',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=900&q=80',
        type: 'image',
        caption: 'Shot 1: Grand conservatory central atrium with bioluminescent ferns'
      },
      {
        id: 'sb-03-m2',
        url: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1800&q=90',
        thumbnailUrl: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=900&q=80',
        type: 'image',
        caption: 'Shot 2: Close-up of crystal dew drops on exotic pitcher plant'
      }
    ],
    prompt: 'Interior architectural elevation of an overgrown Victorian conservatory illuminated by bioluminescent spores, exotic glass flora glowing faintly in soft mint and lilac hues, sunbeams cutting through dusty vaulted glass ceiling, Studio Ghibli meets architectural sketch, intricate linework.',
    createdAt: 'Sep 2, 2026',
    parameters: { model: 'Midjourney v6.1', stylize: 350, seed: 18293 }
  },
  {
    id: 'sb-04',
    title: 'Minimalist Ceramic Pour: Artisan Brand Film',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    category: 'Commercial',
    aspectRatio: '16:9',
    description: 'Sensory macro commercial capture of bespoke artisanal morning coffee ritual. Emphasizes tactile textures, earthy matte ceramics, and steam spirals.',
    mediaItems: [
      {
        id: 'sb-04-m1',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
        type: 'video',
        caption: 'Shot 1: High-speed slow motion pour-over stream'
      }
    ],
    prompt: 'Extreme close up macro shot of hot pour-over coffee cascading through handcrafted ceramic dripper, steam illuminated by warm morning side-lighting, Scandinavian interior backdrop, depth of field f/1.4, slow motion 120fps, luxurious organic commercial aesthetic.',
    createdAt: 'Aug 30, 2026',
    parameters: { model: 'Runway Gen-3 Alpha', fps: 60, camera: 'Dolly in' }
  },
  {
    id: 'sb-05',
    title: 'Chrono Weaver: Steampunk Guardian Character',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1800&q=90',
    category: 'Character',
    aspectRatio: '16:9',
    description: 'Character turn-around sheet of master horologist wearing leather workshop coat, brass telescopic apparatus, and suspended clockwork orbs.',
    mediaItems: [
      {
        id: 'sb-05-m1',
        url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1800&q=90',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
        type: 'image',
        caption: 'Shot 1: Master portrait with intricate mechanical ocular lenses'
      }
    ],
    prompt: 'Character concept design of an elderly chronomancer engineer wearing brass ocular monocles and weathered leather mechanic coat, intricate floating clockwork gears surrounding gauntleted fingers, soft rim lighting, textured oil paint overlay, dynamic rim shadows.',
    createdAt: 'Aug 28, 2026',
    parameters: { model: 'Flux.1 Pro', steps: 40, seed: 504938 }
  },
  {
    id: 'sb-06',
    title: 'Whimsical Cloud Kingdom: Island in the Sky',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=90',
    category: 'Animation',
    aspectRatio: '16:9',
    description: 'Story visual development keyframe for feature animated production. A tranquil floating island with terraced wheat fields and watermills overlooking endless sunset clouds.',
    mediaItems: [
      {
        id: 'sb-06-m1',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=90',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
        type: 'image',
        caption: 'Shot 1: Golden hour horizon over cloud ocean'
      }
    ],
    prompt: 'Vibrant stylized animation storyboard art of a floating pastoral island tethered by giant golden chains above pastel cumulus clouds, tiny red-roofed cottages and watermills, golden hour lighting, Makoto Shinkai aesthetic, high emotional resonance, vivid color grading.',
    createdAt: 'Aug 26, 2026',
    parameters: { model: 'Niji v6', style: 'expressive', seed: 772910 }
  },
  {
    id: 'sb-07',
    title: 'Urban Kinetic Drift: Night Highway Commercial',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    category: 'Commercial',
    aspectRatio: '16:9',
    description: 'High adrenaline nighttime automotive commercial sequence showcasing aerodynamics and reactive LED headlights reflecting on slick highway asphalt.',
    mediaItems: [
      {
        id: 'sb-07-m1',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80',
        type: 'video',
        caption: 'Shot 1: Low ground chase camera tracking vehicle profile'
      }
    ],
    prompt: 'Low angle tracking camera following an aerodynamic electric concept car curving along an elevated coastal highway bridge at dusk, light trails streaking across curved carbon fiber panels, cinematic anamorphic blue flares, razor-sharp automotive commercial styling.',
    createdAt: 'Aug 24, 2026',
    parameters: { model: 'Kling AI v1.5', duration: '5s', speed: 'dynamic' }
  },
  {
    id: 'sb-08',
    title: 'Submerged Sanctuary: Sunken Atlantean Ruins',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=900&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=1800&q=90',
    category: 'Cinematic',
    aspectRatio: '16:9',
    description: 'Diving expedition discovery shot of ancient sunken temple arches overgrown with sea fans and sapphire hydroids in deep Mediterranean waters.',
    mediaItems: [
      {
        id: 'sb-08-m1',
        url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=1800&q=90',
        thumbnailUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=900&q=80',
        type: 'image',
        caption: 'Shot 1: Panoramic underwater colonnade with dancing surface caustics'
      }
    ],
    prompt: 'Underwater panoramic composition of marble Corinthian pillars submerged in crystalline sapphire ocean depths, schools of bioluminescent glassfish swimming through archways, caustics dancing on sandy seafloor, high dynamic range, National Geographic documentary depth.',
    createdAt: 'Aug 21, 2026',
    parameters: { model: 'Midjourney v6.1', ar: '16:9', stylize: 250 }
  }
];
