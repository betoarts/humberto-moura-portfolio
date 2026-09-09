"""Build static cards and versioned assets. Requires only Python standard library."""
from pathlib import Path
import hashlib, json, html as markup
ROOT=Path(__file__).resolve().parents[1]
def asset(name,text,ext):
 data=text.encode(); filename=f'{name}.{hashlib.sha256(data).hexdigest()[:12]}.{ext}'
 (ROOT/'dist/assets'/filename).write_bytes(data)
 return '/assets/'+filename
projects=json.loads((ROOT/'scripts/projects-data.json').read_text())
project_script=(ROOT/'scripts/projects-source.js').read_text().replace('__PROJECT_DATA__',json.dumps(projects,ensure_ascii=False,separators=(',',':')))
css='\n'.join((ROOT/p).read_text() for p in ['scripts/base.css','dist/assets/experience.css','dist/assets/studio.css'])
assets={'__SITE_CSS__':asset('site',css,'css'),'__PROJECT_SCRIPT__':asset('projects',project_script,'js'),'__EXPERIENCE_SCRIPT__':asset('experience',(ROOT/'dist/assets/experience.js').read_text(),'js'),'__STUDIO_SCRIPT__':asset('studio',(ROOT/'dist/assets/studio.js').read_text(),'js')}
html=(ROOT/'scripts/index.template.html').read_text()
for key,value in assets.items():html=html.replace(key,value)
sizes='(max-width: 600px) calc(100vw - 32px), (max-width: 1050px) calc((100vw - 74px) / 2), 607px'
def esc(x):return markup.escape(str(x),quote=True)
cards=[]
for i,p in enumerate(projects):
 cards.append(f'''<article class="project reveal" data-project="{i}"><div class="cover"><img src="{p['thumbnail']}" srcset="{p['thumbnail']} 640w, {p['image']} {p['imageWidth']}w" sizes="{sizes}" width="{p['imageWidth']}" height="{p['imageHeight']}" alt="{esc(p['name'])}: {esc(p['category'])}" loading="lazy" decoding="async" draggable="false"></div><div class="project-body"><div class="project-meta"><span>{esc(p['category'])}</span><span>projeto {i+1:02}</span></div><h3>{esc(p['name'])}</h3><p>{esc(p['summary'])}</p><div class="project-bottom"><div class="chips">{''.join('<span class="chip">'+esc(t)+'</span>' for t in p['tags'][:3])}</div><button class="project-open" type="button" aria-label="Ver detalhes de {esc(p['name'])}">↗</button></div></div></article>''')
html=html.replace('__PROJECT_CARDS__',''.join(cards))
(ROOT/'dist/index.html').write_text(html)
(ROOT/'build-manifest.json').write_text(json.dumps(assets,indent=2)+'\n')
print('Generated',len(assets),'versioned assets and',len(cards),'static project cards.')
