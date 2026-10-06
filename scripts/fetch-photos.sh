#!/usr/bin/env bash
# Download royalty-free clinical imagery from Unsplash into public/images/photo.
#
# Ids were selected by browsing Unsplash search results (descriptions noted) and
# favouring calm, non-graphic, outpatient-appropriate subjects over operating
# theatre imagery, which does not suit a community oncology clinic.
#
# Usage: scripts/fetch-photos.sh [name]
#   with no argument it fetches every entry; pass a name to fetch just one.
set -u
cd "$(dirname "$0")/.."
mkdir -p public/images/photo public/candidates

# name|id|width|description
CATALOG=(
  "hero-consult|1631217868264-e5b90bb7e133|1800|smiling doctor in white coat talking with a patient in clinic"
  "consult-two|1631217871099-88310a909a32|1400|clinician in white shirt holding a document"
  "consult-bed|1584516150909-c43483ee7932|1200|doctor speaking with a patient"
  "consult-care|1586324304780-c9a5031a3599|1200|two people holding hands, one in a blue shirt"
  "hands-support|1758691462071-757bca955439|1200|doctor comforting a patient with a hand on the arm"
  "reception|1581982231900-6a1a46b744c9|1400|waiting room seating in a medical clinic"
  "reception-plants|1637665759389-41818b867562|1200|room with chairs and a potted plant"
  "clinic-still|1584982751601-97dcc096659c|1200|stethoscope on a light clinical surface"
  "team-walk|1516841273335-e39b37888115|1200|medical staff walking through a corridor"
  "lab-research|1579154204601-01588f351e67|1400|laboratory and research imagery"
  "calm-leaf|1470058869958-2a77ade41c02|1000|green foliage, calm accent"
)

want="${1:-}"
ok=0; bad=0
for row in "${CATALOG[@]}"; do
  IFS='|' read -r name id width desc <<<"$row"
  [ -n "$want" ] && [ "$want" != "$name" ] && continue
  out="public/images/photo/$name.jpg"
  url="https://images.unsplash.com/photo-$id?auto=format&fit=crop&w=$width&q=74"
  code=$(curl -sS -m 60 -o "$out" -w "%{http_code}" "$url")
  size=$(wc -c <"$out" | tr -d ' ')
  if [ "$code" = "200" ] && [ "$size" -gt 10000 ]; then
    echo "ok    $name ($size b) - $desc"
    ok=$((ok+1))
  else
    echo "FAIL  $name http=$code size=$size"
    rm -f "$out"; bad=$((bad+1))
  fi
done

# Remove any stale files that are no longer in the catalogue.
ls public/images/photo 2>/dev/null | while read -r f; do
  keep=0
  for row in "${CATALOG[@]}"; do
    IFS='|' read -r name _ _ _ <<<"$row"
    [ "$f" = "$name.jpg" ] && keep=1
  done
  [ "$keep" -eq 0 ] && rm -f "public/images/photo/$f"
done

echo "--- $ok ok, $bad failed ---"
