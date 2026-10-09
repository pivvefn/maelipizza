import type { Metadata } from "next";

import RevealOnScroll from "@/components/RevealOnScroll";
import GestioneCookie from "@/components/privacy/GestioneCookie";

export const metadata: Metadata = {
  title: "Informativa e Privacy",
  description:
    "Informativa sulla privacy e sui cookie di Maeli Pizza: quali dati trattiamo, quali cookie usiamo, come gestire o revocare il tuo consenso e quali sono i tuoi diritti.",
};

const TELEFONO = "+39 350 109 6092";

function Sezione({
  icona,
  titolo,
  id,
  children,
}: {
  icona: string;
  titolo: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="p-space-md md:p-space-xl rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-4 scroll-mt-32 reveal reveal-slow reveal-fade"
    >
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 shrink-0 rounded-full bg-primary-container/10 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[22px]">{icona}</span>
        </span>
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          {titolo}
        </h2>
      </div>
      <div className="space-y-3 font-body-md text-body-md text-on-surface-variant">
        {children}
      </div>
    </section>
  );
}

function Tecnologia({
  nome,
  categoria,
  durata,
  finalita,
}: {
  nome: string;
  categoria: string;
  durata: string;
  finalita: string;
}) {
  return (
    <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <code className="font-title-md text-title-md font-bold text-on-surface break-all">
          {nome}
        </code>
        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-bold uppercase tracking-wide shrink-0">
          {categoria}
        </span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        {finalita}
      </p>
      <p className="font-label-sm text-label-sm text-secondary font-semibold">
        Durata: {durata}
      </p>
    </div>
  );
}

export default function InformativaPrivacyPage() {
  return (
    <main className="w-full pt-28 bg-surface min-h-screen">
      <RevealOnScroll />

      {/* Testata */}
      <section className="w-full bg-on-surface py-space-2xl">
        <div className="max-w-4xl mx-auto px-margin md:px-margin-desktop">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/15 backdrop-blur-md border border-surface/20 text-surface mb-4 reveal reveal-slow reveal-fade">
            <span className="material-symbols-outlined text-primary text-[18px]">
              shield_lock
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Trasparenza sui tuoi dati
            </span>
          </div>
          <h1 className="font-display text-display-mobile md:text-display text-surface tracking-tight leading-tight font-bold reveal reveal-slow reveal-fade delay-150">
            Informativa sulla privacy e cookie
          </h1>
          <p className="font-body-lg text-body-lg text-surface-container-high max-w-2xl leading-relaxed mt-4 reveal reveal-slow reveal-fade delay-300">
            In questa pagina ti spieghiamo, con parole semplici, quali dati
            raccogliamo quando visiti il nostro sito, quali cookie vengono
            usati, come gestire le tue scelte e quali sono i tuoi diritti.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-margin md:px-margin-desktop py-space-2xl space-y-space-xl">
        <Sezione icona="storefront" titolo="Titolare del trattamento">
          <p>
            Il titolare del trattamento dei dati personali è{" "}
            <strong className="text-on-surface">
              Maeli Pizza di Martino &amp; Elisa S.n.c.
            </strong>
            , con sede in Via del Molino, 6 — 31021 Campocroce di Mogliano
            Veneto (TV), P. IVA 03489210274.
          </p>
          <p>
            Per qualsiasi richiesta relativa ai tuoi dati puoi contattarci
            telefonicamente o su WhatsApp al{" "}
            <a
              href="tel:+393501096092"
              className="text-primary font-semibold hover:underline underline-offset-4"
            >
              {TELEFONO}
            </a>
            .
          </p>
        </Sezione>

        <Sezione icona="database" titolo="Quali dati trattiamo">
          <ul className="space-y-2.5 list-disc pl-5">
            <li>
              <strong className="text-on-surface">
                Dati che inserisci nel carrello
              </strong>{" "}
              (nome, numero di telefono, orario di ritiro e note per il
              fornaio): restano salvati{" "}
              <strong className="text-on-surface">
                solo sul tuo dispositivo
              </strong>{" "}
              nel salvataggio locale del carrello. Vengono trasmessi a WhatsApp
              (Meta Platforms) <em>solo se</em> scegli di inviare la richiesta
              oppure li usi tu per la chiamata: non vengono mai archiviati sui
              nostri server.
            </li>
            <li>
              <strong className="text-on-surface">Dati di navigazione</strong>:
              durante la visita il server registra informazioni tecniche
              minime (indirizzo IP, tipo di browser, data e ora delle
              richieste) necessarie al funzionamento e alla sicurezza del sito.
            </li>
            <li>
              Il sito non prevede registrazione di account, pagamenti online,
              newsletter né profilazione pubblicitaria. Nessuna decisione
              automatizzata viene presa sui tuoi dati.
            </li>
          </ul>
        </Sezione>

        <Sezione icona="cookie" titolo="Cookie e tecnologie simili">
          <p>
            Utilizziamo un numero contenuto di cookie e tecnologie affini,
            divisi per categoria. Le prime due categorie sono opzionali e le
            puoi gestire in ogni momento.
          </p>

          <div className="space-y-space-sm pt-1">
            <p className="font-label-sm text-label-sm uppercase tracking-widest font-bold text-primary">
              Necessari — sempre attivi
            </p>
            <Tecnologia
              nome="maeli-consent"
              categoria="Cookie"
              durata="12 mesi"
              finalita="Memorizza le scelte che hai fatto su questo banner, per non chiedertele a ogni visita."
            />
            <Tecnologia
              nome="maeli-carrello-v1"
              categoria="LocalStorage"
              durata="Fino a quando non svuoti il carrello"
              finalita="Conserva le pizze, le quantità e le note inserite nel carrello del listino, esclusivamente sul tuo dispositivo."
            />
          </div>

          <div className="space-y-space-sm pt-1">
            <p className="font-label-sm text-label-sm uppercase tracking-widest font-bold text-primary">
              Statistiche — solo con il tuo consenso
            </p>
            <Tecnologia
              nome="Vercel Analytics"
              categoria="Terzo"
              durata="Sessione di misurazione"
              finalita="Statistiche anonime e aggregate sulle visite (pagine viste e provenienza generale), senza cookie di profilazione né tracciamento pubblicitario. Se non lo consenti, questo servizio non viene caricato."
            />
          </div>

          <div className="space-y-space-sm pt-1">
            <p className="font-label-sm text-label-sm uppercase tracking-widest font-bold text-primary">
              Mappa — solo con il tuo consenso
            </p>
            <Tecnologia
              nome="Google Maps (iframe)"
              categoria="Terzo"
              durata="Fino alla revoca del consenso"
              finalita="Carica la mappa interattiva della sede sulla home page. Se non lo consenti, la mappa non viene visualizzata e nessun cookie di Google viene impostato."
            />
          </div>

          <p className="pt-1">
            <strong className="text-on-surface">Risorse tecniche</strong>: i
            caratteri (Google Fonts) e le icone (Material Symbols) sono
            richiesti a Google per lo stile del sito: servono a renderlo
            fruibile e non impostano cookie di profilazione. WhatsApp non usa
            cookie su questo sito: il messaggio parte soltanto quando apri
            l&apos;app con un tuo gesto esplicito.
          </p>
        </Sezione>

        <Sezione id="cookie" icona="tune" titolo="I tuoi cookie e le tue scelte">
          <p>
            Qui sotto vedi le preferenze attualmente salvate. Puoi modificarle
            o revocarle in qualsiasi momento: le modifiche hanno effetto
            immediato.
          </p>
          <GestioneCookie />
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Se cancelli i cookie del browser, il banner di scelta ricomparirà
            alla prossima visita. Rifiutare le categorie opzionali non limita
            la navigazione: cambia soltanto la mappa della home (non
            visualizzata) e le statistiche di visita (disattivate).
          </p>
        </Sezione>

        <Sezione icona="public" titolo="Servizi di terze parti">
          <ul className="space-y-2.5 list-disc pl-5">
            <li>
              <strong className="text-on-surface">Google Maps</strong> (Google
              Ireland Ltd): mappa della sede, caricata solo con consenso.{" "}
              <a
                href="https://policies.google.com/privacy?hl=it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                Informativa Google
              </a>
            </li>
            <li>
              <strong className="text-on-surface">Vercel</strong> (Vercel
              Inc.): hosting del sito e statistiche di visita, solo con
              consenso.{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                Informativa Vercel
              </a>
            </li>
            <li>
              <strong className="text-on-surface">WhatsApp</strong> (Meta
              Platforms Ireland Ltd): interviene esclusivamente se scegli di
              inviare la tua richiesta di ordinazione, aprendo l&apos;app.{" "}
              <a
                href="https://www.whatsapp.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                Informativa WhatsApp
              </a>
            </li>
          </ul>
          <p className="font-body-sm text-body-sm">
            I dati vengono trattati primariamente nell&apos;Unione Europea; per
            i servizi basati fuori dall&apos;UE sono in vigore le clausole
            contrattuali standard previste dal GDPR.
          </p>
        </Sezione>

        <Sezione icona="gavel" titolo="I tuoi diritti">
          <p>
            Ai sensi degli articoli 15–22 del Regolamento (UE) 2016/679 puoi
            chiedere in ogni momento: accesso ai dati, rettifica,
            cancellazione, limitazione del trattamento, opposizione, nonché la{" "}
            <strong className="text-on-surface">revoca del consenso</strong>{" "}
            già prestato (senza pregiudicare la liceità dei trattamenti
            basati sul consenso prestato prima della revoca).
          </p>
          <p>
            Per esercitare i diritti contattaci al{" "}
            <a
              href="tel:+393501096092"
              className="text-primary font-semibold hover:underline underline-offset-4"
            >
              {TELEFONO}
            </a>
            . Hai inoltre diritto di proporre reclamo al{" "}
            <a
              href="https://www.garanteprivacy.it/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline underline-offset-4"
            >
              Garante per la protezione dei dati personali
            </a>
            .
          </p>
        </Sezione>

        <Sezione icona="history" titolo="Conservazione e aggiornamenti">
          <ul className="space-y-2.5 list-disc pl-5">
            <li>
              I dati inseriti nel carrello restano sul tuo dispositivo fino a
              quando non svuoti il carrello o non li invii via WhatsApp.
            </li>
            <li>
              Le preferenze cookie durano 12 mesi; i log tecnici del server
              vengono conservati per il tempo necessario al funzionamento e
              alla sicurezza.
            </li>
            <li>
              Questa informativa può essere aggiornata in caso di cambiamenti
              al sito o ai servizi utilizzati.
            </li>
          </ul>
          <p className="font-label-sm text-label-sm text-secondary font-semibold">
            Ultimo aggiornamento: ottobre 2026
          </p>
        </Sezione>
      </div>
    </main>
  );
}
