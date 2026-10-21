# HTTP e API REST

Laboratorio 03.16 (*Chiamate HTTP: da JSONPlaceholder ai fatti sui gatti*) e dispensa 03.15 (*HTTP e API REST*) del Modulo 03 - Angular.

Il progetto Angular (v22) e' nella cartella [`angular-http`](angular-http). Contiene:

- **Post**: `GET`/`POST` su JSONPlaceholder (un post con il pipe `json`, elenco, invio, post a pagine);
- **Gatti**: fatti sui gatti da catfact.ninja;
- **NASA**: foto astronomica del giorno (APOD) con chiave API nei file di ambiente, e foto di un altro giorno;
- **Pokedex**: tipi e ricerca di un Pokemon su PokeAPI;
- **Todo**: attivita' da JSONPlaceholder con `POST` e `DELETE` (esempio della dispensa 03.15).

Le risposte alle domande sono in [`RISPOSTE.md`](RISPOSTE.md) (laboratorio, con la tabella del Passo 6) e in
[`RISPOSTE-TEORIA.md`](RISPOSTE-TEORIA.md) (domande di verifica della dispensa).

## Come avviare il progetto

La chiave API della NASA **non e' nel repository** (e' nel `.gitignore`). Prima di avviare l'app bisogna creare i due file di ambiente
partendo dall'esempio:

```bash
cd angular-http
npm install
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.example.ts src/environments/environment.development.ts
```

Poi si apre `environment.ts` ed `environment.development.ts` e si sostituisce `INSERISCI_QUI_LA_TUA_CHIAVE` con una chiave
(gratuita su <https://api.nasa.gov>; per una prova veloce va bene `DEMO_KEY`, che pero' ha limiti molto bassi). Infine:

```bash
npx ng serve
```

e si apre <http://localhost:4200>.

Senza i due file di ambiente la compilazione si ferma con `TS2307: Cannot find module '../../environments/environment'`.

## Cronologia dei commit

Un commit per ogni passo del laboratorio (`Passo 1: ...` fino a `Passo 9: ...`), poi i tre `Prova tu livello N`, la pagina Todo
della dispensa e le risposte.
