# ATOUT SERVICES 29

Strona wizytówkowa (HTML/CSS) — Brest, Finistère.

Folder projektu: `atout-services-29/`  
Podgląd lokalny: otwórz `index.html` przez Live Server albo:

```bash
python -m http.server 8080
```

Następnie: http://127.0.0.1:8080

## Co jest zrobione

- Wszystkie podstrony po francusku
- Menu, stopka, przycisk devis, pasek mobilny
- Formularz (Web3Forms + honeypot + walidacja)
- Mentions légales i confidentialité zgodne z KBis
- `robots.txt`, `sitemap.xml`, `_headers`, `_redirects`

## Przed publikacją (Cloudflare Pages)

1. Konto [Web3Forms](https://web3forms.com/) — wklej klucz w `contact.html` zamiast `REPLACE_WITH_WEB3FORMS_KEY`.
2. Jeśli masz telefon: wpisz ten sam numer w `js/main.js` (`phoneDisplay`, `phoneTel`, `whatsapp`). Format wyświetlania jeden na całą stronę.
3. Repo prywatne na GitHub → Cloudflare Pages (Framework: None, output `/`).
4. Domena `.fr` (OVH/Gandi/IONOS) + nameservery Cloudflare.
5. Email Routing: `contact@` i `devis@`.
6. Własne zdjęcia prac w `img/realisations/` (WebP, ~1600 px). Oryginały trzymaj w `../zdjecia-surowe/`.

Nie wrzucaj do Gita skanu KBis ani zdjęć 10 MB.
