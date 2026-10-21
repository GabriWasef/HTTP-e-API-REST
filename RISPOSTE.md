# RISPOSTE - Laboratorio 03.16 (Chiamate HTTP)

## Passo 6 - Richieste osservate nella scheda Network

Filtro **Fetch/XHR**, app avviata con `ng serve`, pagina **Post**. I valori qui sotto sono quelli osservati davvero
(registrati aprendo l'app in un browser Chromium automatizzato e annotando metodo, URL e stato di ogni richiesta).

| Pulsante | Metodo | URL | Stato |
| --- | --- | --- | --- |
| **Carica un post** (con 1) | `GET` | `https://jsonplaceholder.typicode.com/posts/1` | 200 |
| **Carica un post** (con 999) | `GET` | `https://jsonplaceholder.typicode.com/posts/999` | 404 |
| **Carica tutti** | `GET` | `https://jsonplaceholder.typicode.com/posts` | 200 |
| **Invia un post** | `POST` | `https://jsonplaceholder.typicode.com/posts` | 201 |

Altre osservazioni:

- **Payload e Response della POST.** Il payload e' `{"userId":1,"title":"Primo post da Angular","body":"Inviato con HttpClient"}`;
  la risposta contiene lo stesso oggetto con in piu' `"id": 101`. Premendo di nuovo **Invia un post** l'id e' ancora 101:
  JSONPlaceholder e' un'API finta e non salva nulla.
- **Richiesta `OPTIONS`.** Nella scheda Network dei veri strumenti per sviluppatori puo' comparire, prima della POST, una richiesta
  `OPTIONS` (il *preflight* CORS: il browser chiede al server il permesso di inviare JSON da un'altra origine). Il mio strumento di
  registrazione automatico non mostra i preflight, quindi **non l'ho osservata direttamente**: la riporto solo come comportamento atteso.
- **Browser offline.** Con la rete scollegata (**Offline** nella scheda Network) premendo **Carica tutti** la richiesta non parte:
  l'app mostra `Errore 0: Http failure response for https://jsonplaceholder.typicode.com/posts: 0 undefined`.
  Lo stato **0** significa "la richiesta non e' arrivata al server".

## Domande a cui rispondere

**1. A che cosa serve `provideHttpClient()` e in quale file va scritto?**
Serve a configurare il servizio `HttpClient` per l'intera app, cioè il punto in cui si imposta l'HTTP (per esempio per aggiungere
a ogni richiesta un token di accesso). Si scrive nell'array `providers` di `src/app/app.config.ts`, accanto a `provideRouter(routes)`.
Nelle versioni meno recenti di Angular, se lo si dimenticava, compariva l'errore `NullInjectorError: No provider for HttpClient!`.

**2. Che differenza c'e' tra `constructor(public http: HttpClient)` e `private readonly http = inject(HttpClient)`? Quale non funziona in una classe `@Service()`?**
Fanno la stessa cosa: chiedono ad Angular l'istanza di `HttpClient`. Nel primo caso la dipendenza e' un parametro del costruttore
(notazione vecchia, `public` la rende anche accessibile da fuori); nel secondo e' un campo della classe inizializzato con la funzione
`inject()` (notazione moderna, piu' corta, `private readonly` evita usi sbagliati). Dentro una classe `@Service()` **non funziona
il costruttore**: l'ho provato e la compilazione si ferma con
`NG2028: @Service class cannot use constructor dependency injection. Use the inject function instead.`
Funziona solo `inject()`.

**3. Che cos'e' un Observable? Quando parte la richiesta scritta in `getPosts()`?**
Un Observable e' un "valore futuro": un oggetto della libreria RxJS che rappresenta dati che arriveranno piu' tardi (la risposta del
server non e' immediata). E' come l'abbonamento a una newsletter: finche' non ti iscrivi non arriva nulla. `getPosts()` **non fa
partire la richiesta**: restituisce soltanto l'Observable. La richiesta parte quando qualcuno chiama `subscribe` su quell'Observable
(nell'app, quando il componente esegue `caricaTutti()`). Senza `subscribe` la scheda Network resta vuota; con due `subscribe` partono
due richieste.

**4. Che cosa fanno `next` ed `error` in `subscribe({ next, error })`? Quale dei due viene chiamato con il post 999, e con quale codice di stato?**
`next` viene chiamata quando arriva un valore (per una richiesta HTTP un solo valore: la risposta; dopo l'Observable si chiude da solo).
`error` viene chiamata al posto di `next` se la richiesta fallisce (stato 4xx o 5xx, rete assente, richiesta bloccata dal browser).
Con il post 999 viene chiamata **`error`**, con codice di stato **404** (Not Found): il post non esiste. Nella pagina compare
"Errore 404: Http failure response for https://jsonplaceholder.typicode.com/posts/999: 404".

**5. Perche' `post`, `posts`, `loading` ed `errore` sono signal? Che cosa succederebbe con delle proprieta' semplici?**
Perche' la risposta arriva in modo asincrono, molto dopo il click e fuori dal normale ciclo del template. Angular e' *zoneless*:
nessuno lo avvisa che una proprieta' e' cambiata. Con `this.posts.set(dati)` il signal avvisa Angular, che aggiorna solo la parte di
template che lo legge. Con una proprieta' semplice (`posts: Post[] = []` e poi `this.posts = dati`) il valore nella classe cambierebbe,
la risposta si vedrebbe nella scheda Network, ma la pagina resterebbe vuota (e lo spinner non si spegnerebbe).

**6. Perche' conviene tipizzare le risposte con un'interfaccia (`Post`, `CatFact`) invece di usare `any`? Esempio di errore che l'interfaccia ti fa scoprire subito.**
Con l'interfaccia l'editor ti da' l'autocompletamento e il compilatore controlla i nomi dei campi, quindi scopri gli errori prima
di eseguire l'app e non a runtime (dove un campo sbagliato e' solo `undefined`). Con `any` il compilatore non controlla niente.
Esempio verificato: scrivendo `p.titolo` invece di `p.title` la compilazione si ferma con
`TS2339: Property 'titolo' does not exist on type 'Post'.` (vale sia nel codice TypeScript sia nel template).
Attenzione: TypeScript si fida dell'interfaccia e non controlla il JSON che arriva davvero, per questo l'interfaccia va scritta
guardando una risposta vera.

**7. Che cosa fa il pipe `json` e perche' e' utile durante lo sviluppo?**
Trasforma un oggetto in testo JSON indentato (`{{ p | json }}`). Dentro un `<pre>` permette di vedere esattamente che cosa ha
risposto il server, senza dover scrivere subito il template definitivo. Per usarlo `JsonPipe` va messo negli `imports` del componente,
altrimenti la compilazione si ferma con `NG8004: No pipe found with name 'json'`.

**8. Perche' la `POST` restituisce sempre l'id 101? Perche' nella `POST` non si usa `JSON.stringify`?**
JSONPlaceholder e' un'API *finta*: contiene 100 post e risponde come farebbe un server vero, assegnando al nuovo post l'id successivo
(101), ma **non salva nulla**. Per questo premendo piu' volte "Invia un post" l'id resta 101 e, ricaricando l'elenco, i post sono
ancora 100. `JSON.stringify` non serve (e non va usato) perche' `HttpClient` trasforma da solo l'oggetto in JSON e aggiunge
l'header `Content-Type: application/json`; se si passasse una stringa, verrebbe inviata come testo semplice e molti server non
la capirebbero.

**9. Descrivi i passi con cui hai tenuto la chiave della NASA fuori dal repository. A che cosa serve `environment.example.ts`?**
1. `ng g environments` crea `src/environments/environment.ts` ed `environment.development.ts` e aggiorna `angular.json`
   (con `ng serve` Angular usa il file `.development` al posto dell'altro; nel codice si importa sempre `environment` senza suffisso).
2. **Prima di qualsiasi commit** ho aggiunto i due file veri al `.gitignore` del progetto
   (`/src/environments/environment.ts` e `/src/environments/environment.development.ts`).
3. Ho creato `environment.example.ts`, **da committare**, con un segnaposto al posto della chiave (`'INSERISCI_QUI_LA_TUA_CHIAVE'`).
4. Nei due file veri ho scritto la chiave (personale, oppure `DEMO_KEY` per le prove).
5. Con `git status` ho controllato che tra i file nuovi ci fossero `.gitignore`, `angular.json` ed `environment.example.ts`,
   ma **non** i due file con la chiave (verificato anche con `git check-ignore -v` e `git ls-files`).

`environment.example.ts` serve a chi clona il repository (anche il docente, per correggere): copiandolo due volte con i nomi
`environment.ts` ed `environment.development.ts` e inserendo la propria chiave, il progetto compila. Senza questi file la
compilazione si ferma con `TS2307: Cannot find module '../../environments/environment'`.

**10. Perche' la chiave in un'app Angular non e' comunque segreta? Dove andrebbe tenuta una chiave davvero importante?**
Perche' tutto il codice di un'app Angular, file di ambiente compresi, viene scaricato ed eseguito dal browser, dove chiunque puo'
leggerlo con gli strumenti per sviluppatori (per esempio nella scheda Network la chiave compare nell'URL `?api_key=...`).
Il `.gitignore` protegge la chiave dal repository pubblico, non dagli utenti dell'app. Una chiave davvero segreta deve stare su un
**server** che fa la richiesta all'API al posto del browser (cosi' il browser non la vede mai): e' quello che si fara' nel
modulo full stack.
