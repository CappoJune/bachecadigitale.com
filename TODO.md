# TODO - Progetto Blog Collaborativo "Bacheca Digitale"

## Obiettivo
Creare un blog collaborativo semplice in italiano, stile lavagna digitale pubblica, con post anonimi, immagini, feed cronologico, playbook curato, ricerca, filtri, modalità scura/chiara, e pannello admin.

## Linee Guida di Codifica
- Codice semplice e pulito, comprensibile anche da sviluppatori con conoscenze base.
- Commenti chiari in italiano per funzioni, classi e blocchi principali.
- Nomi variabili descrittivi (es. userNickname, postContent).
- Struttura HTML semantica, CSS organizzato con commenti, JS modulare e commentato.
- Backend con commenti su rotte e query.
- README in italiano con istruzioni di installazione, struttura e modifica testi.

## Struttura del Progetto
- /backend
  - server.js (Express app)
  - database.js (configurazione SQLite)
- /public
  - index.html (Bacheca)
  - playbook.html (Sezione Playbook)
  - info.html (Pagina Informazioni)
  - admin.html (Pannello Admin nascosto)
  - /css/styles.css (stili con commenti)
  - /js/app.js (logica frontend)
  - /uploads (immagini caricate)
- README.md

## Passi da Completare

### Setup Iniziale
- [ ] Creare package.json e installare dipendenze (express, sqlite3, multer, cors, ecc.)
- [ ] Configurare server Express e database SQLite

### Backend
- [ ] Rotte API per:
  - [ ] Creazione post (testo, immagine, nickname, tag)
  - [ ] Recupero post feed cronologico
  - [ ] Like post
  - [ ] Segnala post (flag)
  - [ ] Ricerca e filtro per tag
  - [ ] Gestione playbook (promozione post da admin)
  - [ ] Pannello admin: revisione, cancellazione, moderazione
- [ ] Implementare limitazione rate/IP
- [ ] Gestione upload immagini con limiti e compressione base

### Frontend
- [ ] Pagina Bacheca (index.html)
  - [ ] Form di invio post con campi in italiano e captcha semplice
  - [ ] Visualizzazione feed con post come card arrotondate
  - [ ] Pulsanti Mi piace e Segnala
  - [ ] Barra di ricerca e filtri tag
  - [ ] Toggle modalità scura/chiara
- [ ] Pagina Playbook (playbook.html)
  - [ ] Visualizzazione post promossi con stile guida professionale
- [ ] Pagina Informazioni (info.html)
  - [ ] Testo descrittivo su scopo e contributo
- [ ] Pannello Admin (admin.html)
  - [ ] Accesso nascosto (es. via URL segreto)
  - [ ] Revisione post segnalati, moderazione, promozione playbook

### Contenuti Seed
- [ ] Creare esempi di post e playbook in italiano

### Documentazione
- [ ] Scrivere README.md in italiano con:
  - [ ] Come installare e avviare il progetto
  - [ ] Struttura del codice
  - [ ] Come modificare testi/etichette

## Note
- Commenti in italiano in tutto il codice
- Indicare parti facilmente modificabili (colori, dimensione max immagine, testi)
- Design mobile-first e responsive

---

Procederò con la creazione del progetto seguendo questi passi.
