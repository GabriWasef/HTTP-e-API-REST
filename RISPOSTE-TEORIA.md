# Dispensa 03.15 - HTTP e API REST: domande di verifica

**1. Descrivi il modello client-server usando come esempio un'app del meteo: chi fa la richiesta, chi risponde, dove stanno i dati?**
Il client e' l'app Angular che gira nel browser dell'utente; il server e' un programma su un computer remoto che custodisce i dati
(le previsioni) e risponde alle domande dei client. Quando l'utente apre la pagina, l'app invia una *richiesta*
(per esempio `GET /previsioni?citta=Milano`); il server cerca i dati nel suo database e risponde con una *risposta* (`200 OK` con il
JSON delle previsioni); l'app aggiorna la pagina. Poi la conversazione finisce: il server non chiama mai il client per primo.
I dati stanno sul server, non nell'app.

**2. Elenca le parti di una richiesta HTTP e di una risposta. In quali richieste c'e' un body?**
Richiesta: metodo (che cosa voglio fare), URL (su quale risorsa), header (informazioni di contorno, come il formato dei dati inviati),
body (i dati che invio). Risposta: codice di stato (com'e' andata), header, body (di solito JSON).
Il body c'e' solo in alcuni metodi: `POST`, `PUT` e `PATCH` (sempre); `GET` non lo ha, `DELETE` di solito no.

**3. Associa ogni metodo HTTP alla sua operazione CRUD e scrivi, per la risorsa "libri", l'endpoint REST di ciascuna operazione.**

| Operazione CRUD | Metodo | Endpoint per i libri |
| --- | --- | --- |
| Create (creare) | `POST` | `POST /libri` (dati nel body) |
| Read (leggere) | `GET` | `GET /libri` (elenco), `GET /libri/5` (un libro) |
| Update (aggiornare) | `PUT` (sostituisce tutto) / `PATCH` (solo alcuni campi) | `PUT /libri/5`, `PATCH /libri/5` |
| Delete (cancellare) | `DELETE` | `DELETE /libri/5` |

Gli URL contengono nomi al plurale, mai verbi: l'azione e' gia' indicata dal metodo.

**4. Che cosa indicano i codici 201, 204, 403, 404 e 500? Che differenza c'e' tra un errore 4xx e uno 5xx?**
201 Created: risorsa creata (tipico di una `POST`). 204 No Content: richiesta riuscita ma niente da restituire (tipico di una
`DELETE`). 403 Forbidden: sei riconosciuto ma non hai il permesso (o la chiave API non e' valida). 404 Not Found: la risorsa non
esiste. 500 Internal Server Error: il server ha avuto un problema. Un errore **4xx** e' un errore del *client* (ha chiesto qualcosa
di sbagliato: URL inesistente, dati non validi, niente permessi); un errore **5xx** e' un errore del *server* (la richiesta era
corretta, ma il server non e' riuscito a servirla).

**5. Scrivi un JSON che descrive un libro (titolo, autori come lista, anno, disponibile) e l'interfaccia TypeScript corrispondente.**

```json
{
  "titolo": "Il nome della rosa",
  "autori": ["Umberto Eco"],
  "anno": 1980,
  "disponibile": true
}
```

```ts
export interface Libro {
  titolo: string;
  autori: string[];
  anno: number;
  disponibile: boolean;
}
```

**6. Che cosa si aggiunge in `app.config.ts` per usare `HttpClient`? Che cosa succedeva, nelle versioni meno recenti di Angular, se lo si dimenticava?**
Si aggiunge `provideHttpClient()` nell'array `providers` (importato da `@angular/common/http`). Nelle versioni meno recenti, senza questa
riga, l'app dava l'errore `NullInjectorError: No provider for HttpClient!`. Nelle versioni recenti `HttpClient` e' disponibile anche
senza, ma la riga resta il punto in cui si configura l'HTTP dell'app. (Nel codice meno recente si trova anche
`provideHttpClient(withFetch())`: oggi `withFetch()` non serve piu', perche' il motore `fetch` del browser e' gia' quello predefinito.)

**7. Che cos'e' un Observable? Quando parte davvero la richiesta di `http.get`? Che cosa succede se chiami `subscribe` due volte?**
E' la promessa di un valore futuro (oggetto della libreria RxJS): la risposta del server non e' immediata, quindi `http.get` non puo'
restituire i dati ma restituisce un Observable. La richiesta parte **solo quando si chiama `subscribe`**; senza `subscribe` non succede
niente. Se si chiama `subscribe` due volte, partono **due richieste** distinte.

**8. Spiega il ruolo di `next` ed `error` in `subscribe({ next, error })`. In quali situazioni viene chiamata `error`?**
`next` viene chiamata quando arriva un valore: per una richiesta HTTP uno solo, la risposta (poi l'Observable si chiude da solo,
non serve annullare l'iscrizione). `error` viene chiamata al posto di `next` se la richiesta fallisce: codice di stato 4xx o 5xx,
rete assente (stato 0), richiesta bloccata dal browser (per esempio da CORS).

**9. Perche' `todos`, `loading` ed `errore` sono signal? Descrivi che cosa vedrebbe l'utente se `todos` fosse una proprieta' semplice.**
Perche' `next` viene eseguita quando arriva la risposta, molto dopo il click e fuori da qualunque evento del template, e Angular e'
*zoneless*: nessuno lo avvisa che una proprieta' e' cambiata. Con `this.todos.set(dati)` il signal avvisa Angular, che aggiorna il
template. Se `todos` fosse una proprieta' semplice (`todos: Todo[] = []` e `this.todos = dati`), il valore nella classe cambierebbe ma
la pagina resterebbe **vuota**: l'utente vedrebbe (per sempre) l'elenco vuoto o il messaggio "Nessuna attivita'", anche se nella scheda
Network la risposta e' arrivata. Per lo stesso motivo lo spinner non si spegnerebbe. Regola del modulo: se arriva da una richiesta
HTTP, va in un signal.

**10. A che cosa serve scrivere `http.get<Todo[]>`? TypeScript controlla davvero il contenuto della risposta?**
Dice a TypeScript che la risposta sara' una lista di `Todo`: nel resto del codice si hanno autocompletamento e controllo sui nomi dei
campi (un nome sbagliato ferma la compilazione). **Non** controlla il contenuto reale: TypeScript si fida del programmatore e non
verifica il JSON che arriva. Se l'interfaccia non corrisponde alla risposta vera, gli errori compaiono a runtime (un campo
`undefined`); per questo l'interfaccia si scrive guardando una risposta vera.

**11. Riscrivi in stile moderno `constructor(public http: HttpClient)` e `subscribe(this.getData)` con `getData = (d) => { this.data = d; }`, e spiega perche' `getData` doveva essere una arrow function.**

```ts
private readonly http = inject(HttpClient);
readonly data = signal<Dato[]>([]);

carica(): void {
  this.servizio.getDati().subscribe({
    next: (d) => this.data.set(d),
    error: (err: HttpErrorResponse) => { /* gestione dell'errore */ },
  });
}
```

Nel codice vecchio `getData` doveva essere una *arrow function* per conservare il `this` del componente: passando a `subscribe` un
metodo normale, `this` sarebbe stato perso (al momento della chiamata non avrebbe piu' puntato al componente). Con
`subscribe({ next: (d) => ... })` l'arrow function e' scritta sul posto, dentro il metodo del componente, quindi `this` e' quello
giusto e il problema non si pone. In piu' la proprieta' `data` diventa un signal, aggiornato con `.set()`.

**12. Dove va messa una chiave API in un progetto Angular, e come si evita che finisca su GitHub? Perche' questo non la rende davvero segreta, e che cosa c'entra il server?**
Va messa nei **file di ambiente** (`ng g environments` crea `src/environments/environment.ts` ed `environment.development.ts`), importando
sempre `environment` dal file senza suffisso. Per evitare che finisca su GitHub: i due file veri si aggiungono al `.gitignore`
**prima di qualsiasi commit**, e si committa solo un `environment.example.ts` con un segnaposto (chi clona lo copia due volte e inserisce
la propria chiave). Se la chiave era gia' stata committata, bisogna toglierla dall'indice con
`git rm --cached` sui due file, fare il commit e, se e' gia' su GitHub, richiederne una nuova. Questo non la rende davvero segreta
perche' il codice di un'app Angular (file di ambiente compresi) viene scaricato ed eseguito dal browser, dove chiunque puo' leggerlo
con gli strumenti per sviluppatori; il `.gitignore` protegge solo il repository. Una chiave davvero segreta deve stare su un **server**
che fa la richiesta all'API al posto del browser.

**Prova tu (dispensa 03.15).** Nella pagina **Todo** dell'app (`src/app/todos`) ho aggiunto `deleteTodo(id: number): Observable<unknown>`
al servizio (con `this.http.delete(...)`) e un pulsante **Elimina** accanto a ogni attivita': quando arriva la risposta l'attivita'
viene tolta dalla lista con `update` e `filter`. Nella scheda Network la richiesta e' `DELETE https://jsonplaceholder.typicode.com/todos/1`
con stato **200** (JSONPlaceholder risponde `{}` e, come per la `POST`, non cancella nulla davvero). Provando
`https://jsonplaceholder.typicode.com/todos/999` nel browser, la pagina mostra `{}` e lo stato e' **404 Not Found**: la risorsa non esiste.
