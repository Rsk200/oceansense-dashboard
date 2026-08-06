import urllib.request, json, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

sources = [
    'https://raw.githubusercontent.com/deldersveld/topojson/master/countries/bangladesh/bangladesh-districts.json',
    'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/bangladesh.geojson',
    'https://raw.githubusercontent.com/wmgeolab/geoBoundaries/main/releaseData/gbOpen/BGD/ADM0/geoBoundaries-BGD-ADM0.geojson',
]

for url in sources:
    try:
        print('Trying:', url[:60])
        req = urllib.request.urlopen(url, timeout=20, context=ctx)
        raw = req.read()
        data = json.loads(raw)
        t = data.get('type', '?')
        keys = list(data.keys())[:5]
        print('  Type:', t, 'Keys:', keys)
        if t == 'FeatureCollection' and data.get('features'):
            with open('frontend/src/assets/bangladesh.geojson', 'w') as f:
                json.dump(data, f, separators=(',', ':'))
            print('  SAVED as FeatureCollection with', len(data['features']), 'features')
            break
        elif t == 'Topology':
            print('  TopoJSON - skipping')
    except Exception as e:
        print('  Error:', str(e)[:100])
