require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/schemas/blogSchema');

// Sample blog data with all required fields
const blogData = [
  {
    blogid: 12,
    name: "Top 5 Zodiac Signs That Make the Best Leaders",
    title: "Top 5 Zodiac Signs That Make the Best Leaders",
    banner: "banner.jpg",
    article: `<p class="MsoNormal" style="text-align: justify;"><span style="font-family: 'Aptos',sans-serif;">Leadership comes in many forms, and astrology can offer insights into the traits that make someone a natural leader. Among the 12 zodiac signs, five stand out for their exceptional leadership abilities. Let's explore how Aries, Leo, Capricorn, Scorpio, and Aquarius excel in guiding others and achieving their goals.</span></p>
<h2>Aries: The Bold Trailblazer</h2>
<p>Aries is known for their fearless approach to challenges. They thrive in situations where quick decision-making and confidence are required.</p>`,
    excerpt: "Discover which zodiac signs make the best leaders and why",
    author: "Admin",
    publishdate: Math.floor(Date.now() / 1000),
    is_published: true
  },
  {
    blogid: 13,
    name: "Understanding Your Birth Chart: A Beginner's Guide",
    title: "Understanding Your Birth Chart: A Beginner's Guide",
    banner: "banner.jpg",
    article: `<p>Your birth chart is a snapshot of the sky at the exact moment you were born. It reveals your personality traits, strengths, challenges, and life path.</p>
<h2>What is a Birth Chart?</h2>
<p>A birth chart, also called a natal chart, maps the positions of planets, the sun, and moon at your time of birth.</p>`,
    excerpt: "Learn how to read and understand your astrological birth chart",
    author: "Admin",
    publishdate: Math.floor(Date.now() / 1000) - 86400,
    is_published: true
  },
  {
    blogid: 14,
    name: "Mercury Retrograde: What It Really Means",
    title: "Mercury Retrograde: What It Really Means",
    banner: "banner.jpg",
    article: `<p>Mercury retrograde is one of the most talked-about astrological events. But what does it actually mean, and how does it affect us?</p>
<h2>Understanding Mercury Retrograde</h2>
<p>When Mercury appears to move backward in the sky, it's called retrograde. This optical illusion occurs 3-4 times per year.</p>`,
    excerpt: "Demystifying the effects of Mercury retrograde on your life",
    author: "Admin",
    publishdate: Math.floor(Date.now() / 1000) - 172800,
    is_published: true
  },
  {
    blogid: 15,
    name: "Zodiac Compatibility: Finding Your Perfect Match",
    title: "Zodiac Compatibility: Finding Your Perfect Match",
    banner: "banner.jpg",
    article: `<p>Understanding zodiac compatibility can provide valuable insights into your relationships. Learn which signs are most compatible with yours.</p>
<h2>Fire Signs Compatibility</h2>
<p>Aries, Leo, and Sagittarius are the fire signs, known for their passion and energy.</p>`,
    excerpt: "Discover which zodiac signs are most compatible with yours",
    author: "Admin",
    publishdate: Math.floor(Date.now() / 1000) - 259200,
    is_published: true
  },
  {
    blogid: 16,
    name: "The Power of Moon Signs in Astrology",
    title: "The Power of Moon Signs in Astrology",
    banner: "banner.jpg",
    article: `<p>While most people know their sun sign, your moon sign is equally important. It represents your emotional nature and inner self.</p>
<h2>What is a Moon Sign?</h2>
<p>Your moon sign is determined by the position of the moon at the time of your birth.</p>`,
    excerpt: "Explore the significance of moon signs and their impact on emotions",
    author: "Admin",
    publishdate: Math.floor(Date.now() / 1000) - 345600,
    is_published: true
  }
];

async function seedBlogs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing blogs (optional - comment out if you want to keep existing data)
    // await Blog.deleteMany({});
    // console.log('✓ Cleared existing blogs');

    // Insert blog data
    const result = await Blog.insertMany(blogData);
    console.log(`✓ Successfully inserted ${result.length} blog posts`);

    // Display inserted blogs
    console.log('\nInserted blogs:');
    result.forEach(blog => {
      console.log(`  - ID: ${blog._id}, BlogID: ${blog.blogid}, Name: ${blog.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding blogs:', error);
    process.exit(1);
  }
}

// Run the seed function
seedBlogs();
