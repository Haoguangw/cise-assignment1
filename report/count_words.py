import re, importlib.util, sys

spec = importlib.util.spec_from_file_location('b', 'build_report.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def wc(t):
    return len(re.findall(r"[A-Za-z0-9][A-Za-z0-9'\-\./:%]*", t))


for k, t in m.BODY:
    if k in ('p', 'h1'):
        print(f'{k:6} {wc(t):4}  {t[:60]}')
for name in ['TABLE1', 'TABLE2', 'TABLE3', 'TABLE4', 'TABLE5']:
    tb = getattr(m, name)
    print(name, sum(wc(c) for r in tb for c in r))
print('TOTAL', m.word_count_texts(m.body_texts()))
