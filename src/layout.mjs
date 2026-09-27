// Shared page shell: <head>, header, footer.
export function layout({ title, description, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/css/style.css">
<script src="/assets/js/main.js" defer></script>
</head>
<body>
${header()}
<main id="main">
${body}
</main>
${footer()}
</body>
</html>
`;
}

function header() {
  return `<header class="site-header">
  <div class="topbar">
    <div class="container topbar__inner">
      <span>Mon - Sun: 8:00am - 5:00pm</span>
      <a href="tel:+13236888088">(323) 688-8088</a>
      <a href="mailto:ami@familyroofinginc.com">office@familyroofinginc.com</a>
    </div>
  </div>
  <div class="container nav-row">
    <a class="logo" href="/"><img src="/assets/img/logo.svg" width="180" height="48"></a>
    <nav>
      <ul class="nav">
        <li><a href="/">Home</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#promo">Fall Promotion</a></li>
        <li><a href="#quote">Contact</a></li>
      </ul>
    </nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <img src="/assets/img/logo.svg" width="180" height="48">
      <p>CLSB License #1116287</p>
    </div>
    <div>
      <h3>Contact</h3>
      <p>1444 N Poinsettia Pl Apt 219<br>Los Angeles, CA 90046</p>
      <p><a href="tel:+13236888088">(323) 688-8088</a><br>
      <a href="mailto:ami@familyroofinginc.com">office@familyroofinginc.com</a></p>
    </div>
    <div>
      <h3>Hours</h3>
      <p>Monday - Friday: 8:00am - 5:00pm<br>Saturday - Closed</p>
    </div>
  </div>
  <p class="copyright">Copyright © 2025 Family Roofing Inc. All rights reserved.</p>
</footer>`;
}
