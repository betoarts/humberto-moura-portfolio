import json, re, tempfile, subprocess, os, xml.etree.ElementTree as ET
from pathlib import Path
from html.parser import HTMLParser
from PIL import Image
root=Path(__file__).resolve().parents[1]; dist=root/'dist'
class HTML(HTMLParser):
 def __init__(self,s):
  super().__init__();self.tags=[];self.feed(s)
 def handle_starttag(self,t,a):self.tags.append((t,dict(a)))
html=(dist/'index.html').read_text(); parsed=HTML(html)
assert len([a for t,a in parsed.tags if t=='h1'])==1
assert len([a for t,a in parsed.tags if t=='article' and 'data-project' in a])==8
covers=[a for t,a in parsed.tags if t=='img' and a.get('loading')=='lazy'];assert len(covers)==8
for img in covers:
 assert all(img.get(x) for x in ['src','srcset','sizes','width','height','alt','decoding'])
for t,a in parsed.tags:
 for key in ['src','href']:
  value=a.get(key,'')
  if value.startswith('/') and value!='/':assert (dist/value.lstrip('/').split('?')[0]).exists(),value
assert 'github.com/' not in ''.join(img['src'] for img in covers)
for image in (dist/'assets/media').glob('*'):
 with Image.open(image) as im:im.verify()
hero=[a for t,a in parsed.tags if t=='img' and a.get('fetchpriority')=='high'];assert len(hero)==1 and 'loading' not in hero[0]
assert html.count('rel="canonical"')==0 # runtime origin is deliberately not guessed
for script in re.findall(r'<script type="application/ld\+json">(.*?)</script>',html,re.S):json.loads(script)
with tempfile.TemporaryDirectory() as td:
 temp=Path(td); src=temp/'templates'; src.mkdir(); out=temp/'public';out.mkdir()
 for p in (root/'deploy').glob('*.template.*'):(src/p.name).write_bytes(p.read_bytes())
 (src/'index.html').write_text(html)
 def run(url):return subprocess.run(['sh',str(root/'deploy/40-portfolio-seo.sh'),str(src),str(out)],env={**os.environ,'SITE_URL':url},capture_output=True,text=True)
 assert run('https://portfolio.example/').returncode==0
 result=(out/'index.html').read_text();assert 'href="https://portfolio.example/"' in result
 assert '__SITE_URL__' not in result
 assert 'property="og:image" content="https://portfolio.example/assets/media/' in result
 assert '/sitemap.xml' in (out/'robots.txt').read_text()
 sitemap=ET.parse(out/'sitemap.xml');assert len(sitemap.findall('.//{http://www.google.com/schemas/sitemap-image/1.1}loc'))==9
 for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>',result,re.S):json.loads(block)
 assert run('https://portfolio.example/other-path').returncode!=0
 assert run('https://portfolio.example?q=1').returncode!=0
 assert run('https://bad.example"><script>').returncode!=0
 assert run('').returncode==0
 assert not (out/'sitemap.xml').exists()
 assert 'rel="canonical"' not in (out/'index.html').read_text()
print('SEO verified: 8 static cards, local images decode, responsive variants, hero priority, structured data, canonical/OG/sitemap origin rendering, invalid origins rejected.')
