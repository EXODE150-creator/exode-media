"""Liens locaux, fragments, métadonnées et ressources du site sans dépendance."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
BASE = 'https://exode-media.com/'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.tags = []
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

def audit():
    errors = []
    pages = {p.resolve(): (p.read_text(encoding='utf-8'), Page(p.read_text(encoding='utf-8')))
             for p in ROOT.rglob('*.html') if '.github' not in p.parts}
    ids = {p: [a['id'] for t, a in data[1].tags if 'id' in a] for p, data in pages.items()}
    titles = set()
    for path, (text, page) in pages.items():
        relative = path.relative_to(ROOT).as_posix()
        label = relative + ': '
        redirect = relative == 'ultra-services/index.html'
        noindex = any(t == 'meta' and a.get('name') == 'robots' and 'noindex' in a.get('content', '') for t, a in page.tags)
        if len(ids[path]) != len(set(ids[path])): errors.append(label + 'identifiant dupliqué')
        if not redirect and sum(t == 'h1' for t, a in page.tags) != 1: errors.append(label + 'h1 unique requis')
        if not redirect and ('style.css?v=20261126' not in text or 'site.js?v=20261126' not in text): errors.append(label + 'cache CSS/JS incohérent')
        if not noindex:
            meta = {a.get('name', a.get('property')): a.get('content') for t, a in page.tags if t == 'meta'}
            title = re.search(r'<title>(.*?)</title>', text).group(1)
            if title in titles: errors.append(label + 'titre dupliqué')
            titles.add(title)
            if 'Exode Média' not in title: errors.append(label + 'marque absente du titre')
            for key in ('description', 'og:title', 'og:description', 'og:image', 'og:image:alt'):
                if not meta.get(key): errors.append(label + 'métadonnée absente ' + key)
            for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S):
                try: json.loads(block)
                except ValueError: errors.append(label + 'JSON-LD invalide')
            if 'application/ld+json' not in text: errors.append(label + 'JSON-LD absent')
        for tag, attrs in page.tags:
            refs = [attrs[k] for k in ('href', 'src', 'poster', 'data-screen') if attrs.get(k)]
            if tag == 'meta' and attrs.get('property') == 'og:image': refs.append(attrs['content'])
            for ref in refs:
                u = urlsplit(ref)
                if u.scheme or u.netloc:
                    if not ref.startswith(BASE): continue
                    target = ROOT / unquote(u.path).lstrip('/')
                else:
                    target = (ROOT / unquote(u.path).lstrip('/') if u.path.startswith('/') else path.parent / unquote(u.path)) if u.path else path
                if target.is_dir(): target /= 'index.html'
                target = target.resolve()
                if not target.exists(): errors.append(label + 'fichier absent ' + ref)
                elif u.fragment and target in ids and unquote(u.fragment) not in ids[target]: errors.append(label + 'ancre absente ' + ref)
            if tag == 'img' and attrs.get('src') and any(k not in attrs for k in ('alt', 'width', 'height')):
                errors.append(label + 'attributs image absents')
            if tag in ('script', 'iframe', 'img', 'source') and attrs.get('src', '').startswith(('https:', 'http:', '//')):
                errors.append(label + 'ressource externe')
    sitemap = ET.parse(ROOT / 'sitemap.xml')
    for url in sitemap.findall('.//{*}loc'):
        target = ROOT / url.text.removeprefix(BASE)
        if target.is_dir(): target /= 'index.html'
        if not target.exists(): errors.append('sitemap : page absente ' + url.text)
    return len(pages), errors

if __name__ == '__main__':
    count, errors = audit()
    for error in errors: print(error)
    print(f'{count} pages contrôlées ; {len(errors)} erreur(s).')
    raise SystemExit(bool(errors))
