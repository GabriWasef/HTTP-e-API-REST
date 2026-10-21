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
