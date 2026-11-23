"""Vérifie que le contrôle accepte les futurs ajouts et détecte les écarts."""
import re
import unittest
from audit_application_cards import ROOT, audit

class CardPolicyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT/'index.html').read_text(encoding='utf-8')
        cls.template = (ROOT/'.github/templates/application-card.html').read_text(encoding='utf-8')
        cls.css = (ROOT/'style.css').read_text(encoding='utf-8')

    def check(self, html=None, css=None):
        return audit(html or self.html, self.template, css or self.css)

    def test_current_cards(self):
        self.assertEqual([], self.check())

    def test_future_application_uses_same_template(self):
        card = re.search(r'      <article class="project project-ultra".*?</article>', self.html, re.S)[0]
        future = card.replace('project-ultra', 'project-future').replace('data-priority="30"', 'data-priority="40"').replace('ultra-title', 'future-title').replace('id="batiment"', 'id="future"').replace('>Ultra Services</h3>', '>Future</h3>')
        self.assertEqual([], self.check(self.html.replace(card, card+'\n'+future)))

    def test_wrong_order(self):
        wrong = self.html.replace('data-availability="available"', 'data-availability="development"', 1).replace('data-availability="soon"', 'data-availability="available"', 1)
        self.assertTrue(any('Ordre HTML' in e for e in self.check(wrong)))

    def test_special_card_structure(self):
        wrong = self.html.replace('<div class="phone-demo"', '<div class="desktop-demo"', 1)
        self.assertTrue(any('structure différente' in e for e in self.check(wrong)))

    def test_special_card_dimensions(self):
        self.assertTrue(any('géométrie' in e for e in self.check(css=self.css+'\n.project-respire { width: 900px; }')))

    def test_wrong_badge(self):
        self.assertTrue(any('badge incohérent' in e for e in self.check(self.html.replace('>Disponible</span>', '>En préparation</span>', 1))))

    def test_duplicate_priority(self):
        self.assertTrue(any('priorité déjà' in e for e in self.check(self.html.replace('data-priority="20"', 'data-priority="10"'))))

if __name__ == '__main__':
    unittest.main()
