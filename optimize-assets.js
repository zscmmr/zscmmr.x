const fs = require('fs');
const path = require('path');

const root = __dirname;
const files = ['index.html', 'portfolio-utama.html', 'website-example.html'];

const minifyCSS = (css) => css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\n+/g, ' ')
  .replace(/\s{2,}/g, ' ')
  .replace(/\s*([{}:;,.>+~\[\]()])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim();

const minifyJS = (js) => js
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/.*$/gm, '')
  .replace(/\n+/g, ' ')
  .replace(/\s{2,}/g, ' ')
  .replace(/\s*([{}();:=,+\-*/%<>!&|\[\]?,])\s*/g, '$1')
  .trim();

fs.mkdirSync(path.join(root, 'assets', 'css'), { recursive: true });
fs.mkdirSync(path.join(root, 'assets', 'js'), { recursive: true });
fs.mkdirSync(path.join(root, 'assets', 'images'), { recursive: true });

for (const img of ['logo1.png', 'logo2.png']) {
  const src = path.join(root, img);
  const dst = path.join(root, 'assets', 'images', img);
  if (fs.existsSync(src) && !fs.existsSync(dst)) {
    fs.copyFileSync(src, dst);
  }
}

for (const file of files) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');

  html = html
    .replace(/src="logo1\.png"/g, 'src="assets/images/logo1.png"')
    .replace(/src="logo2\.png"/g, 'src="assets/images/logo2.png"');

  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  if (styleMatch) {
    const cssFile = path.join(root, 'assets', 'css', file.replace(/\.html$/, '.min.css'));
    fs.writeFileSync(cssFile, minifyCSS(styleMatch[1]), 'utf8');
    html = html.replace(styleMatch[0], '<link rel="stylesheet" href="assets/css/' + path.basename(cssFile) + '">');
  }

  const scriptMatches = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
  for (const match of scriptMatches) {
    const js = minifyJS(match[1]);
    if (!js.trim()) continue;
    const jsFile = path.join(root, 'assets', 'js', file.replace(/\.html$/, '.min.js'));
    fs.writeFileSync(jsFile, js, 'utf8');
    html = html.replace(match[0], '<script defer src="assets/js/' + path.basename(jsFile) + '"></script>');
  }

  if (html.includes('fonts.googleapis.com')) {
    html = html.replace(
      /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com" \/>/g,
      '<link rel="preconnect" href="https://fonts.googleapis.com" />'
    );
    html = html.replace(
      /<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin \/>/g,
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />'
    );
    html = html.replace(
      /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=DM\+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" \/>/g,
      '<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap" media="print" onload="this.media=\'all\'"><noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap"></noscript>'
    );
    html = html.replace(
      /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=DM\+Sans:wght@400;500;600;700&family=Space\+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" \/>/g,
      '<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" media="print" onload="this.media=\'all\'"><noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"></noscript>'
    );
  }

  if (file === 'index.html') html = html.replace(/<script src="https:\/\/unpkg.com\/lucide@latest"><\/script>/g, '<script defer src="https://unpkg.com/lucide@latest"></script>');

  fs.writeFileSync(filePath, html, 'utf8');
}

console.log('optimization complete');
