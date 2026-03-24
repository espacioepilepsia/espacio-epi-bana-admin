const https = require('https');
const fs = require('fs');

const WP_URL = "https://espacioepilepsia.org/wp-json/wp/v2/posts?per_page=100&_embed=1";

https.get(WP_URL, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const posts = JSON.parse(data);
      if (!Array.isArray(posts)) {
        console.error("Error: no array from WP API", posts);
        return;
      }
      
      let sql = "INSERT INTO public.posts (title, slug, content, excerpt, category, published_at, is_published, cover_image_url) VALUES\n";
      
      const values = posts.map(p => {
        const title = (p.title?.rendered || "").replace(/'/g, "''").replace(/\n/g, '\\n');
        const slug = p.slug;
        const rawContent = p.content?.rendered || "";
        const content = rawContent.replace(/'/g, "''").replace(/\n/g, '\\n');
        
        let rawExcerpt = p.excerpt?.rendered || "";
        rawExcerpt = rawExcerpt.replace(/<[^>]*>?/gm, ''); // strip HTML
        const excerpt = rawExcerpt.replace(/'/g, "''").replace(/\n/g, '\\n').trim() || null;
        
        // Find main image
        let image = null;
        if (p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'].length > 0) {
          image = p._embedded['wp:featuredmedia'][0].source_url;
        } else if (p.jetpack_featured_media_url) {
          image = p.jetpack_featured_media_url;
        }
        
        const date = p.date ? `'${p.date}'` : 'NULL';
        const exc = excerpt ? `'${excerpt}'` : 'NULL';
        const img = image ? `'${image}'` : 'NULL';
        
        return `('${title}', '${slug}', '${content}', ${exc}, 'blog', ${date}, true, ${img})`;
      });
      
      sql += values.join(',\n') + ';\n';
      
      fs.writeFileSync('seed_blog.sql', sql, 'utf8');
      console.log(`✅ ¡Generado seed_blog.sql con ${posts.length} artículos del blog!`);
    } catch (e) {
      console.error("Error parsing JSON", e);
    }
  });
}).on("error", (err) => {
  console.log("Error fetching API: " + err.message);
});
