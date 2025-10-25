# Blog Image Setup Instructions

## Overview
Blog images should be stored in folders on your web server following this structure:
```
/blog/
  /12/
    banner.jpg
  /13/
    banner.jpg
  /14/
    banner.jpg
  /15/
    banner.jpg
  /16/
    banner.jpg
```

## Where to Place Images

### Option 1: On astrovaani.com Server
Upload blog images to: `https://astrovaani.com/blog/{blogid}/{banner}`

Example:
- Blog ID 12: `https://astrovaani.com/blog/12/banner.jpg`
- Blog ID 13: `https://astrovaani.com/blog/13/banner.jpg`

### Option 2: Use Placeholder Images (for testing)
If you don't have blog images yet, you can use placeholder images temporarily:

1. Update the frontend to use placeholder URLs
2. Or upload sample images to the blog folders

## Seeded Blog Posts

The following blog posts have been added to MongoDB:

| Blog ID | Title | Banner File |
|---------|-------|-------------|
| 12 | Top 5 Zodiac Signs That Make the Best Leaders | banner.jpg |
| 13 | Understanding Your Birth Chart: A Beginner's Guide | banner.jpg |
| 14 | Mercury Retrograde: What It Really Means | banner.jpg |
| 15 | Zodiac Compatibility: Finding Your Perfect Match | banner.jpg |
| 16 | The Power of Moon Signs in Astrology | banner.jpg |

## Adding More Blogs

To add more blog posts, you can:

1. **Use the seed script**: Edit `seed-blogs.js` and add more blog objects
2. **Use MongoDB Compass**: Manually add documents to the `blog` collection
3. **Create an admin API**: Build an endpoint to create blogs via API

### Blog Document Structure
```json
{
  "blogid": 17,
  "name": "Your Blog Title",
  "title": "Your Blog Title",
  "banner": "banner.jpg",
  "article": "<p>Your HTML content here...</p>",
  "excerpt": "Short description",
  "author": "Admin",
  "publishdate": 1234567890,
  "is_published": true
}
```

## Testing

1. Start the backend: `cd Astrovaani_BE && npm start`
2. Start the frontend: `cd Astrovaani_FE && npx expo start`
3. Navigate to blog section in the app
4. Click on any blog to view details

Note: If images don't load, make sure:
- The image files exist at the correct URL
- The file names match (case-sensitive)
- The blogid matches the folder name
