"""Contrôle du contrat des cartes, sans compilation ni dépendance externe."""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
RANKS = {'available': 0, 'soon': 1, 'development': 2}
LABELS = {'available': 'Disponible', 'soon': 'Bientôt disponible', 'development': 'En préparation'}
VOID = {'img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'wbr'}

class Cards(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.cards = []
        self.stack = []
        self.current = None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = attrs.get('class', '').split()
        if tag == 'article' and 'project' in classes:
            self.current = {'attrs': attrs, 'signature': [], 'screens': [], 'label': '', 'name': '', 'errors': [], 'in_grid': any('application-projects' in c for _, c in self.stack)}
            self.cards.append(self.current)
        if self.current is not None:
            normalized = sorted(c for c in classes if c != 'available' and not (tag == 'article' and c.startswith('project-')))
            self.current['signature'].append(('open', tag, normalized))
            if 'style' in attrs:
                self.current['errors'].append('style inline interdit')
            if 'data-screen' in attrs:
                self.current['screens'].append(attrs)
            if 'project-status' in classes:
                self.current['badge_available'] = 'available' in classes
        if tag not in VOID:
            self.stack.append((tag, classes))

    def handle_endtag(self, tag):
        if self.current is not None:
            self.current['signature'].append(('close', tag))
        if self.stack:
            self.stack.pop()
        if tag == 'article':
            self.current = None

    def handle_data(self, text):
        if self.current is not None and self.stack:
            tag, classes = self.stack[-1]
            if 'project-status' in classes:
                self.current['label'] += text.strip()
            if tag == 'h3':
                self.current['name'] += text.strip()

def audit(html, template, css, root=ROOT):
    cards = Cards(html).cards
    model = Cards(re.sub(r'\{\{[^}]+\}\}', '', template)).cards
    errors = []
    if len(model) != 1:
        return ['Le modèle doit contenir exactement une carte.']
    if not cards:
        return ['Aucune carte trouvée.']
    if html.count('application-projects"') != 1:
        errors.append('Il doit y avoir une seule grille commune application-projects.')
    priorities, keys = set(), []
    for card in cards:
        attrs = card['attrs']
        name = card['name'] or '(sans nom)'
        errors.extend(f'{name}: {e}' for e in card['errors'])
        if not card['in_grid']:
            errors.append(f'{name}: carte en dehors de la grille commune.')
        if card['signature'] != model[0]['signature']:
            errors.append(f'{name}: structure différente du gabarit commun.')
        availability = attrs.get('data-availability')
        if availability not in RANKS:
            errors.append(f'{name}: disponibilité inconnue.')
        if card['label'] != LABELS.get(availability):
            errors.append(f'{name}: badge incohérent avec la disponibilité.')
        if card.get('badge_available') != (availability == 'available'):
            errors.append(f'{name}: couleur du badge incohérente avec la disponibilité.')
        raw = attrs.get('data-priority', '')
        if not raw.isdigit() or int(raw) <= 0:
            errors.append(f'{name}: priorité entière positive requise.')
        else:
            priority = int(raw)
            if priority in priorities:
                errors.append(f'{name}: priorité déjà utilisée.')
            priorities.add(priority)
            keys.append((RANKS.get(availability, 99), priority))
        if len(card['screens']) != 3:
            errors.append(f'{name}: exactement trois captures sont requises.')
        elif sum(s.get('aria-pressed') == 'true' for s in card['screens']) != 1:
            errors.append(f'{name}: une seule capture doit être sélectionnée.')
        for screen in card['screens']:
            path = screen['data-screen']
            if not (root / path).is_file() or not screen.get('data-alt'):
                errors.append(f'{name}: capture ou description manquante ({path}).')
        themes = [c for c in attrs.get('class', '').split() if c.startswith('project-')]
        for selectors, properties in re.findall(r'([^{}]+)\{([^{}]*)\}', css):
            if any(re.search(r'\.' + re.escape(theme) + r'(?![\w-])', selectors) for theme in themes):
                if re.search(r'(?:^|;)\s*(?:width|height|min-width|max-width|min-height|max-height|padding[\w-]*|margin[\w-]*|transform|font[\w-]*|grid[\w-]*|display|position|order)\s*:', properties):
                    errors.append(f'{name}: géométrie spécifique interdite ({selectors.strip()}).')
    if keys != sorted(keys):
        errors.append('Ordre HTML incorrect : disponibles, bientôt disponibles, puis en préparation ; priorité croissante dans chaque état.')
    return errors

if __name__ == '__main__':
    errors = audit((ROOT/'index.html').read_text(encoding='utf-8'), (ROOT/'.github/templates/application-card.html').read_text(encoding='utf-8'), (ROOT/'style.css').read_text(encoding='utf-8'))
    if errors:
        print('\n'.join(errors))
        sys.exit(1)
    names = [c['name'] for c in Cards((ROOT/'index.html').read_text(encoding='utf-8')).cards]
    print('Cartes conformes au gabarit commun ; ordre : ' + ' > '.join(names))
