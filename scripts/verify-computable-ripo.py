#!/usr/bin/env python3
"""Validate the article's downloadable RDF example and built local references.

Run after pnpm run build. Requires rdflib and pyshacl in a separate Python venv;
see docs/computable-ripo-review.md. No JVM/nbb or remote inference is used.
"""
from copy import deepcopy
from decimal import Decimal
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

from pyshacl import validate
from rdflib import Graph, Literal, Namespace, RDF, XSD

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'apps/astro/public/assets/posts/computable-ripo'
DIST = ROOT / 'apps/astro/dist'
RIPO = Namespace('https://example.org/ripo/0.1#')
EX = Namespace('https://example.org/ripo/example/')
SH = Namespace('http://www.w3.org/ns/shacl#')
core = Graph().parse(ASSETS / 'core.ttl')
shapes = Graph().parse(ASSETS / 'shapes.ttl')
data = Graph().parse(ASSETS / 'example.ttl')


def check(graph):
    return validate(graph, shacl_graph=shapes, ont_graph=core,
                    inference='none', abort_on_first=False)


def require(condition, message):
    if not condition:
        raise AssertionError(message)


conforms, _, report = check(data)
require(conforms, report)
print(f'Turtle parsed: core={len(core)}, shapes={len(shapes)}, example={len(data)} triples; positive SHACL conforms')

# Each negative control must fail for its intended focus and constraint.
cases = [
    ('missing after-state', EX.change, RIPO.afterState, None, SH.MinCountConstraintComponent, EX.change),
    ('reversed time', EX.after, RIPO.validAt,
     Literal('2026-10-30T23:59:00Z', datatype=XSD.dateTime), SH.SPARQLConstraintComponent, EX.change),
    ('different subject', EX.after, RIPO.aboutEntity, EX.otherFlow, SH.SPARQLConstraintComponent, EX.change),
    ('different unit', EX.after, RIPO.unit, EX.kelvin, SH.SPARQLConstraintComponent, EX.change),
    ('invalid sign', EX.p1, RIPO.sign, Literal(2), SH.InConstraintComponent, EX.p1),
    ('zero multiplicity', EX.p1, RIPO.multiplicity, Literal(0), SH.MinInclusiveConstraintComponent, EX.p1),
]
for name, subject, predicate, value, component, focus in cases:
    damaged = deepcopy(data)
    damaged.remove((subject, predicate, None))
    if value is not None:
        damaged.add((subject, predicate, value))
    ok, result, detail = check(damaged)
    require(not ok, f'{name}: accepted invalid graph')
    failures = list(result.subjects(SH.sourceConstraintComponent, component))
    require(any((node, SH.focusNode, focus) in result for node in failures),
            f'{name}: wrong constraint/focus\n{detail}')
    print(f'Negative control rejected: {name}')

rows = list(data.query((ASSETS / 'changes.rq').read_text()))
require(len(rows) == 1, f'Unexpected query rows: {rows}')
require(rows[0].delta.toPython() == Decimal('1.0'), 'Incorrect temperature difference')
require(rows[0].entity == EX.waterFlow and rows[0].unit == EX.degreeCelsius,
        'Query lost subject or unit')
print('SPARQL returned one row: waterFlow, delta=1.0, degreeCelsius')

# Reification alone must not materialize the represented claim as an RDF fact.
article = ROOT / 'apps/astro/src/content/posts/toward-computable-ripo.mdx'
source = article.read_text()
for snippet in re.findall(r'```turtle\n(.*?)\n```', source, re.S):
    excerpt = Graph().parse(data=snippet, format='turtle')
    require((EX.after, RIPO.numericValue, Literal(Decimal('21.0'))) not in excerpt,
            'Claim excerpt asserted its represented proposition')
    print('Article Turtle excerpt parsed; represented numeric proposition stays unasserted')

require(source.count('<Ja>') == source.count('</Ja>') == source.count('<En>') == source.count('</En>'),
        'Unpaired language blocks')
for language_block in re.findall(r'<(?:Ja|En)>(.*?)</(?:Ja|En)>', source, re.S):
    require('```' not in language_block, 'Shared code is inside a language block')
ET.parse(ASSETS / 'architecture.svg')


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.text = []
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if (tag, key) in {('a', 'href'), ('img', 'src')}:
                self.links.append(value)
    def handle_data(self, text):
        self.text.append(text)


checked = set()
for locale in ('en', 'ja'):
    page = DIST / locale / 'posts/toward-computable-ripo/index.html'
    require(page.is_file(), f'Missing locale route: {locale}')
    parsed = Links()
    parsed.feed(page.read_text())
    prose = ''.join(parsed.text)
    wanted, unwanted = ('1. RIPO, Inc and physical models', '1. RIPO、Inc、物理モデル') if locale == 'en' else ('1. RIPO、Inc、物理モデル', '1. RIPO, Inc and physical models')
    require(wanted in prose and unwanted not in prose, f'Locale leakage: {locale}')
    for link in parsed.links:
        url = urlsplit(link)
        if url.scheme or not url.path.startswith('/'):
            continue
        target = DIST / unquote(url.path).lstrip('/')
        require(target.is_file() or (target / 'index.html').is_file(), f'Broken local link: {link}')
        checked.add(url.path)

# Every existing revised route must contain the new continuation link.
slugs = [
    'foundations-of-relational-mathematics',
    'foundations-of-relational-informational-process-ontology',
    'information-is-organism', 'spirit-is-information',
    'infomation-is-physical-quantity', 'spirit-in-physics',
    'kotoba-substrate-for-spirit',
]
for slug in slugs:
    for page in DIST.glob(f'*/posts/{slug}/index.html'):
        require('/posts/toward-computable-ripo' in page.read_text(), f'Missing continuation: {page}')
print(f'Both locale routes render without language leakage; {len(checked)} local references resolve; revised routes link back')
print('SVG XML and bilingual/shared-code structure valid')
