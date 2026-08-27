import type { Bilingue } from '../i18n/idioma'

/** Qué widget jugable acompaña al caso. Cada uno vive en src/casos/. */
export type ClaveWidget = 'qr' | 'redondeo' | 'throughput' | 'paywall' | 'chatbot' | 'rls'

export type Decision = {
  titulo: Bilingue
  detalle: Bilingue
}

export type Metrica = {
  valor: string
  etiqueta: Bilingue
}

export type Proyecto = {
  slug: string
  /**
   * Nombre propio (Gladiadores Playa) o descripción bilingüe cuando el cliente
   * va bajo confidencialidad y no se puede nombrar.
   */
  nombre: string | Bilingue
  cliente: Bilingue
  periodo: string
  resumen: Bilingue
  problema: Bilingue
  decisiones: Decision[]
  resultado: Bilingue
  metricas: Metrica[]
  rol: Bilingue
  stack: string[]
  enlaceVivo?: string
  widget: ClaveWidget
  widgetTitulo: Bilingue
  widgetBajada: Bilingue
  /** Trabajo bajo confidencialidad: se cuenta la escala, nunca el interior. */
  confidencial?: boolean
}

export const proyectos: Proyecto[] = [
  {
    slug: 'gladiadores',
    nombre: 'Gladiadores Playa',
    cliente: {
      en: 'Gym in Quintana Roo, Mexico',
      es: 'Gimnasio en Quintana Roo, México',
    },
    periodo: '2026',
    resumen: {
      en: 'A full gym operating system: memberships, QR door access, point of sale, class booking. Live on its own domain, run daily by real staff.',
      es: 'El sistema operativo completo de un gimnasio: membresías, acceso por QR, punto de venta, reserva de clases. En producción con dominio propio, operado a diario por el personal real.',
    },
    problema: {
      en: 'The gym paid monthly for off-the-shelf software that never fit how they actually worked, and reception still ran on paper. Nobody could answer two basic questions: who is inside the gym right now, and did today\'s cash drawer balance?',
      es: 'El gimnasio pagaba una mensualidad por software enlatado que nunca se ajustó a cómo trabajan de verdad, y la recepción seguía en papel. Nadie podía contestar dos preguntas básicas: quién está adentro ahora mismo, y si la caja del día cuadró.',
    },
    decisiones: [
      {
        titulo: {
          en: 'Business rules live in the database, not in the browser',
          es: 'Las reglas de negocio viven en la base, no en el navegador',
        },
        detalle: {
          en: 'Access validation, membership charges and multi-product sales are Postgres functions running as a single transaction. A dropped connection mid-sale can no longer leave the drawer half-updated, and the rules cannot be bypassed by anyone poking at the client.',
          es: 'La validación de acceso, el cobro de membresías y la venta multi-producto son funciones de Postgres que corren en una sola transacción. Una conexión que se cae a media venta ya no puede dejar la caja a medias, y las reglas no se pueden brincar desde el cliente.',
        },
      },
      {
        titulo: {
          en: 'The member\'s phone is the membership card',
          es: 'El teléfono del socio es la credencial',
        },
        detalle: {
          en: 'No plastic, no printer, no reissue costs. Members open a web portal and show a QR. Reception scans it with a cheap USB reader — which turned out to be a keyboard device with no Enter suffix, so the input auto-validates the moment it recognises a UUID-shaped burst under 75ms.',
          es: 'Sin plástico, sin impresora, sin costo de reposición. El socio abre un portal web y muestra su QR. Recepción lo escanea con un lector USB barato — que resultó ser un teclado HID sin sufijo Enter, así que el input auto-valida en cuanto detecta una ráfaga con forma de UUID en menos de 75 ms.',
        },
      },
      {
        titulo: {
          en: 'Multi-location from day one',
          es: 'Multi-sede desde el primer día',
        },
        detalle: {
          en: 'The owner talked about a second gym as a someday. Building the location dimension in from the start cost days; retrofitting it later would have cost a rewrite of every query, every report and every cash drawer.',
          es: 'El dueño hablaba de un segundo gimnasio como un algún día. Meter la dimensión de sede desde el inicio costó días; agregarla después habría costado reescribir cada consulta, cada reporte y cada corte de caja.',
        },
      },
      {
        titulo: {
          en: 'Time zone is a business rule, not a formatting detail',
          es: 'La zona horaria es una regla de negocio, no un detalle de formato',
        },
        detalle: {
          en: 'The gym is in America/Cancun, the server is not. Membership expiry, daily cutoffs and "today\'s" revenue all resolve through a single database function so a renewal at 11pm never silently eats a day.',
          es: 'El gimnasio está en America/Cancun, el servidor no. El vencimiento de membresías, los cortes del día y los ingresos de "hoy" se resuelven en una sola función de base para que una renovación a las 11 de la noche nunca se coma un día en silencio.',
        },
      },
    ],
    resultado: {
      en: 'Fourteen modules in production on the gym\'s own domain, installable as an app. Staff feedback after real use drove a second round: deletion across catalogs with an audit trail of who deleted what, and classes decoupled from membership plans.',
      es: 'Catorce módulos en producción bajo el dominio propio del gimnasio, instalable como app. El feedback del personal tras el uso real disparó una segunda ronda: borrado en catálogos con auditoría de quién borró qué, y clases desacopladas de los planes de membresía.',
    },
    metricas: [
      { valor: '14', etiqueta: { en: 'modules in production', es: 'módulos en producción' } },
      { valor: '<75ms', etiqueta: { en: 'QR scan to verdict', es: 'del escaneo al veredicto' } },
      { valor: '0', etiqueta: { en: 'plastic cards issued', es: 'credenciales de plástico' } },
    ],
    rol: {
      en: 'Sole developer — discovery with the client, database design, frontend, deployment and post-launch iteration.',
      es: 'Único desarrollador — levantamiento con el cliente, diseño de base de datos, frontend, despliegue e iteración post-lanzamiento.',
    },
    stack: [
      'React 19',
      'TypeScript',
      'Vite',
      'Supabase',
      'PostgreSQL',
      'Row Level Security',
      'TanStack Query',
      'Material UI',
      'PWA',
      'Vercel',
    ],
    enlaceVivo: 'https://gladiadoresplaya.com.mx',
    widget: 'qr',
    widgetTitulo: {
      en: 'Scan a member in',
      es: 'Deja entrar a un socio',
    },
    widgetBajada: {
      en: 'This is the real access logic. Scan someone twice in a row and watch anti-passback stop the card being handed back over the turnstile.',
      es: 'Esta es la lógica de acceso real. Escanea a alguien dos veces seguidas y mira cómo el anti-passback impide que le pasen la credencial a un amigo por encima del torniquete.',
    },
  },

  {
    slug: 'distribuidora-gas',
    // Cliente bajo confidencialidad: se describe el negocio, no el nombre.
    nombre: {
      en: 'Gas distributor billing system',
      es: 'Sistema de facturación de distribuidora de gas',
    },
    cliente: {
      en: 'LP gas distributor (name withheld)',
      es: 'Distribuidora de gas LP (nombre reservado)',
    },
    periodo: '2026',
    resumen: {
      en: 'Migrating a 10,850-line Windows desktop app that bills gas consumption into a web application — without touching the production database the business runs on.',
      es: 'Migrar una app de escritorio de Windows de 10,850 líneas que factura consumo de gas hacia una aplicación web — sin tocar la base de producción con la que opera el negocio.',
    },
    problema: {
      en: 'A WPF desktop app with roughly 60 screens handled every meter reading, receipt and account balance for the distributor. It only ran on Windows machines in the office, and the money logic it encoded existed nowhere else — no spec, no tests, just the code.',
      es: 'Una app de escritorio WPF con unas 60 pantallas manejaba cada lectura de medidor, recibo y saldo de la distribuidora. Solo corría en las máquinas Windows de la oficina, y la lógica de dinero que codificaba no existía en ningún otro lado — sin especificación, sin pruebas, solo el código.',
    },
    decisiones: [
      {
        titulo: {
          en: 'Rewrite the app. Do not migrate the database.',
          es: 'Reescribir la app. No migrar la base.',
        },
        detalle: {
          en: 'The obvious move was a fresh Postgres schema. I argued against it: doing both at once means that when a balance disagrees you cannot tell whether the new code or the new schema is at fault, and it makes running old and new side by side during the cutover impossible without bidirectional sync. The new app talks to the existing SQL database through Prisma. Moving the data is a later, optional phase.',
          es: 'Lo obvio era un esquema nuevo en Postgres. Argumenté en contra: hacer las dos cosas a la vez significa que cuando un saldo no cuadre no puedes saber si la culpa es del código nuevo o del esquema nuevo, y hace imposible correr lo viejo y lo nuevo en paralelo durante el corte sin sincronización bidireccional. La app nueva habla con la base SQL existente vía Prisma. Mover los datos es una fase posterior y opcional.',
        },
      },
      {
        titulo: {
          en: 'Port the money logic first, with tests, before any UI',
          es: 'Portar la lógica de dinero primero, con pruebas, antes de cualquier UI',
        },
        detalle: {
          en: 'The financial rules came out of the desktop app into an isolated domain layer with 46 tests, written before a single screen existed. Screens are cheap to redo; a balance that silently drifts is not.',
          es: 'Las reglas financieras salieron de la app de escritorio hacia una capa de dominio aislada con 46 pruebas, escritas antes de que existiera una sola pantalla. Las pantallas son baratas de rehacer; un saldo que se descuadra en silencio no.',
        },
      },
      {
        titulo: {
          en: 'Security triage before the first commit',
          es: 'Triaje de seguridad antes del primer commit',
        },
        detalle: {
          en: 'Reading the legacy code turned up four hardcoded credentials, authorization commented out on eight API controllers, and CORS open to everything. Those were fixed and the secrets moved to environment variables before anything was ever committed to git — and the legacy source was kept out of the published repository entirely.',
          es: 'Leer el código heredado destapó cuatro credenciales en duro, la autorización comentada en ocho controladores de la API y CORS abierto a todo. Eso se arregló y los secretos se movieron a variables de entorno antes de que nada llegara a git — y el código heredado se mantuvo completamente fuera del repositorio publicado.',
        },
      },
    ],
    resultado: {
      en: 'The domain layer and its test suite are done and deployed; the app runs in a demo mode that refuses to write once a real database URL is present. The rounding bug below is the single most valuable thing the port found.',
      es: 'La capa de dominio y su suite de pruebas están terminadas y desplegadas; la app corre en un modo demo que se cierra solo en cuanto existe una URL de base real. El bug de redondeo de abajo es lo más valioso que encontró la migración.',
    },
    metricas: [
      { valor: '10,850', etiqueta: { en: 'lines of legacy code read', es: 'líneas de código heredado leídas' } },
      { valor: '46', etiqueta: { en: 'tests on the money logic', es: 'pruebas sobre la lógica de dinero' } },
      { valor: '4', etiqueta: { en: 'leaked credentials found', es: 'credenciales expuestas encontradas' } },
    ],
    rol: {
      en: 'Technical lead on the migration — legacy analysis, architecture, domain port and the written recommendation the client approved.',
      es: 'Líder técnico de la migración — análisis del legado, arquitectura, port del dominio y la recomendación escrita que el cliente aprobó.',
    },
    stack: [
      'Next.js',
      'TypeScript',
      'Prisma',
      'SQL Server',
      'decimal.js',
      'Vitest',
      'Vercel',
    ],
    widget: 'redondeo',
    widgetTitulo: {
      en: 'The bug that would have eaten the balance',
      es: 'El bug que se habría comido el saldo',
    },
    widgetBajada: {
      en: 'C# rounds .5 to the nearest even number. JavaScript rounds it up. Nobody documents this. Run a thousand receipts through both and watch the gap open.',
      es: 'C# redondea .5 al par más cercano. JavaScript redondea hacia arriba. Nadie documenta esto. Corre mil recibos por los dos caminos y mira cómo se abre la diferencia.',
    },
    confidencial: true,
  },

  {
    slug: 'banco-azteca',
    nombre: 'Banco Azteca',
    cliente: {
      en: 'Retail bank, Mexico',
      es: 'Banca minorista, México',
    },
    periodo: '2024 — 2026',
    resumen: {
      en: 'Origination front end at national retail-bank scale: account opening, investments and insurance — thousands of operations every single day, across the branch network.',
      es: 'Front de originación a escala de banca minorista nacional: apertura de cuentas, inversiones y seguros — miles de operaciones cada día, en toda la red de sucursales.',
    },
    problema: {
      en: 'Opening a bank account, taking out an investment or issuing an insurance policy are regulated, multi-step processes: identity checks, document capture, and several back-end systems that all have to end up agreeing. At thousands of operations a day, the gap between a flow that mostly works and one that actually works is measured in hours of branch staff time and in customers who walk out.',
      es: 'Abrir una cuenta, contratar una inversión o emitir un seguro son procesos regulados de varios pasos: validación de identidad, captura de documentos y varios sistemas de fondo que tienen que terminar coincidiendo. A miles de operaciones diarias, la distancia entre un flujo que casi funciona y uno que sí funciona se mide en horas del personal de sucursal y en clientes que se van.',
    },
    decisiones: [
      {
        titulo: {
          en: 'One state store for a flow that spans many screens',
          es: 'Un solo estado para un flujo que cruza muchas pantallas',
        },
        detalle: {
          en: 'The data captured in step two decides which fields even exist in step six, and the same customer record feeds three different products. Keeping that in a central store instead of passing it down screen by screen is what makes the flow auditable — you can look at one place and know exactly what the branch has captured so far.',
          es: 'Lo que se captura en el paso dos decide qué campos existen siquiera en el paso seis, y el mismo expediente del cliente alimenta tres productos distintos. Tener eso en un estado central en vez de irlo pasando pantalla por pantalla es lo que vuelve el flujo auditable: miras un solo lugar y sabes exactamente qué lleva capturado la sucursal.',
        },
      },
      {
        titulo: {
          en: 'Retries are a feature, not error handling',
          es: 'Los reintentos son una funcionalidad, no manejo de errores',
        },
        detalle: {
          en: 'At this volume a failure that hits one call in a thousand happens many times a day, and branch connections drop. So the flow retries and picks up where it left off instead of throwing the customer back to step one. Making a client sign the same paperwork twice because a request timed out is not a technical problem, it is a lost customer.',
          es: 'A este volumen, una falla que pega en una de cada mil llamadas ocurre muchas veces al día, y las conexiones de sucursal se caen. Por eso el flujo reintenta y retoma donde se quedó en vez de aventar al cliente al paso uno. Hacer que alguien vuelva a firmar todo porque una petición expiró no es un problema técnico, es un cliente perdido.',
        },
      },
      {
        titulo: {
          en: 'The API answer and the screen answer are rarely the same shape',
          es: 'Lo que responde la API y lo que necesita la pantalla casi nunca tienen la misma forma',
        },
        detalle: {
          en: 'Core banking services answer with the shape the core banking system needs, not the shape a form needs. Normalising that at the boundary — one place that translates in and out — keeps the product code readable and means a change on the service side does not ripple through every screen.',
          es: 'Los servicios de core bancario responden con la forma que necesita el core, no con la que necesita un formulario. Normalizar eso en la frontera —un solo lugar que traduce de ida y de vuelta— mantiene legible el código de producto y hace que un cambio del lado del servicio no se propague a todas las pantallas.',
        },
      },
      {
        titulo: {
          en: 'Optimise for the worst branch, not the best',
          es: 'Optimizar para la peor sucursal, no para la mejor',
        },
        detalle: {
          en: 'Performance targets came from the slowest hardware and the weakest connection in the network, because that branch is where the queue forms.',
          es: 'Los objetivos de rendimiento salieron del hardware más lento y la conexión más débil de la red, porque esa sucursal es donde se forma la fila.',
        },
      },
    ],
    resultado: {
      en: 'Three product lines running in daily production use across the national branch network.',
      es: 'Tres líneas de producto en uso productivo diario a lo largo de la red nacional de sucursales.',
    },
    metricas: [
      { valor: '1000s', etiqueta: { en: 'operations per day', es: 'operaciones por día' } },
      { valor: '3', etiqueta: { en: 'product lines: accounts, investments, insurance', es: 'líneas: cuentas, inversiones, seguros' } },
      { valor: 'Nacional', etiqueta: { en: 'branch network coverage', es: 'cobertura de la red' } },
    ],
    rol: {
      en: 'Frontend engineer on the origination flows — state, API integration and the retry behaviour.',
      es: 'Ingeniero frontend en los flujos de originación — estado, integración con APIs y el comportamiento de reintentos.',
    },
    stack: ['JavaScript', 'React', 'Redux', 'REST APIs'],
    widget: 'throughput',
    widgetTitulo: {
      en: 'What "thousands a day" actually looks like',
      es: 'Cómo se ve de verdad "miles al día"',
    },
    widgetBajada: {
      en: 'Scale is easy to write on a CV and hard to feel. This runs at real rate — every dot is an operation, and the red ones are the calls that failed and had to be retried.',
      es: 'La escala es fácil de escribir en un CV y difícil de sentir. Esto corre al ritmo real — cada punto es una operación, y los rojos son las llamadas que fallaron y hubo que reintentar.',
    },
    confidencial: true,
  },

  {
    slug: 'cipromex',
    nombre: 'CIPROMEX',
    cliente: {
      en: 'Exam prep platform',
      es: 'Plataforma de preparación para examen',
    },
    periodo: '2026',
    resumen: {
      en: 'A subscription study platform for Mexican university admission exams — where the hardest problem turned out to be that the data everyone uses is wrong.',
      es: 'Plataforma de estudio por suscripción para el examen de admisión universitaria — donde el problema más difícil resultó ser que los datos que todo mundo usa están mal.',
    },
    problema: {
      en: 'Students pick which degree to aim for based on last year\'s cutoff scores. The dataset the platform started from had the mapping between score and degree scrambled, which is worse than having no data at all: it tells a student they are safe when they are not.',
      es: 'Los estudiantes eligen a qué carrera tirarle según los puntajes de corte del año pasado. El dataset del que partió la plataforma tenía revuelto el mapeo entre puntaje y carrera, que es peor que no tener datos: le dice a un estudiante que va seguro cuando no lo va.',
    },
    decisiones: [
      {
        titulo: {
          en: 'Rebuild the dataset by hand from the official source',
          es: 'Reconstruir el dataset a mano desde la fuente oficial',
        },
        detalle: {
          en: 'The university publishes the real numbers but blocks scraping. So they got captured and transcribed by hand — 216 official pages, 216 rows verified against the source. Sanity check: the highest cutoff in the rebuilt data is the medical degree, which is exactly what anyone in Mexico would expect and what the broken dataset got wrong.',
          es: 'La universidad publica los números reales pero bloquea el scraping. Así que se capturaron y transcribieron a mano — 216 páginas oficiales, 216 filas verificadas contra la fuente. Prueba de humo: el corte más alto en los datos reconstruidos es Médico Cirujano, exactamente lo que cualquiera en México esperaría y justo lo que el dataset roto tenía mal.',
        },
      },
      {
        titulo: {
          en: 'Modality is part of the key',
          es: 'La modalidad es parte de la llave',
        },
        detalle: {
          en: 'The same degree at the same campus has wildly different cutoffs depending on whether it is on-campus, open or distance learning — 105 versus 62 for law. Collapsing those into one number would have quietly misled every student choosing the open track.',
          es: 'La misma carrera en el mismo plantel tiene cortes radicalmente distintos según sea escolarizado, abierto o a distancia — 105 contra 62 en Derecho. Colapsarlos en un solo número habría desorientado en silencio a todo estudiante que eligiera la modalidad abierta.',
        },
      },
      {
        titulo: {
          en: 'The free tier is a real product, capped',
          es: 'El plan gratis es un producto real, con tope',
        },
        detalle: {
          en: 'Free users get a genuine daily allowance rather than a crippled demo. The limit is enforced server-side on the answer endpoint — never in the UI, where it would be one devtools toggle away.',
          es: 'El usuario gratis recibe una cuota diaria real en vez de una demo mutilada. El límite se aplica del lado del servidor en el endpoint de respuesta — nunca en la UI, donde estaría a un toggle de devtools de distancia.',
        },
      },
    ],
    resultado: {
      en: 'Paywall verified end to end, official score data live behind a modality selector, and a "my goal" feature that pins a student\'s target degree and campus to their dashboard.',
      es: 'Paywall verificado de punta a punta, datos oficiales de puntajes en vivo detrás de un selector de modalidad, y una función de "mi meta" que fija la carrera y plantel objetivo del estudiante en su panel.',
    },
    metricas: [
      { valor: '216', etiqueta: { en: 'official records transcribed', es: 'registros oficiales transcritos' } },
      { valor: '4', etiqueta: { en: 'subscription tiers', es: 'niveles de suscripción' } },
      { valor: '403', etiqueta: { en: 'enforced server-side, not in the UI', es: 'aplicado en el servidor, no en la UI' } },
    ],
    rol: {
      en: 'Sole developer — monorepo, API, frontend, billing and the data rebuild.',
      es: 'Único desarrollador — monorepo, API, frontend, cobros y la reconstrucción de los datos.',
    },
    stack: [
      'React',
      'TypeScript',
      'Tailwind',
      'Zustand',
      'Express',
      'Prisma',
      'PostgreSQL',
      'Socket.io',
      'Stripe',
      'Turborepo',
    ],
    widget: 'paywall',
    widgetTitulo: {
      en: 'Hit the paywall yourself',
      es: 'Pega tú contra el paywall',
    },
    widgetBajada: {
      en: 'Answer questions as a free user. The tenth one is free too. The eleventh is not.',
      es: 'Contesta preguntas como usuario gratis. La décima también es gratis. La once no.',
    },
  },

  {
    slug: 'express',
    nombre: 'EXPRESS',
    cliente: {
      en: 'Financial services company',
      es: 'Empresa de servicios financieros',
    },
    periodo: '2026',
    resumen: {
      en: 'A WhatsApp FAQ bot that answers the same six questions the sales team was answering by hand — and a lesson in deleting infrastructure.',
      es: 'Un bot de FAQ en WhatsApp que contesta las mismas seis preguntas que el equipo de ventas contestaba a mano — y una lección sobre borrar infraestructura.',
    },
    problema: {
      en: 'The company helps people cash out their housing-fund savings. Prospects arrive on WhatsApp asking the same handful of questions, most of them anxious ones — will this affect my pension, why am I paying a fee on my own money. Answering by hand was slow and the answers drifted between staff.',
      es: 'La empresa ayuda a capitalizar el ahorro de vivienda en efectivo. Los prospectos llegan por WhatsApp con el mismo puñado de preguntas, casi todas de nervios — si esto afecta mi pensión, por qué me cobran por mi propio dinero. Contestar a mano era lento y las respuestas variaban entre una persona y otra.',
    },
    decisiones: [
      {
        titulo: {
          en: 'Threw away two automation platforms to end with one file',
          es: 'Tiré dos plataformas de automatización para terminar con un archivo',
        },
        detalle: {
          en: 'The first build was a visual workflow tool. The second was a different one. Both worked in the editor and fought back everywhere else. The version that shipped is a single serverless function: receive webhook, ask the model, send reply. Less to learn, less to break, nothing to renew.',
          es: 'La primera versión fue en una herramienta visual de workflows. La segunda en otra distinta. Las dos funcionaban en el editor y peleaban en todos lados más. La versión que salió es una sola función serverless: recibe webhook, pregunta al modelo, manda respuesta. Menos que aprender, menos que romper, nada que renovar.',
        },
      },
      {
        titulo: {
          en: 'The bot hands off instead of guessing',
          es: 'El bot canaliza en vez de adivinar',
        },
        detalle: {
          en: 'On pricing and anything case-specific it routes to a human advisor by design. A confident wrong answer about someone\'s savings is far more expensive than a slow one.',
          es: 'En precios y en cualquier cosa que dependa del caso, canaliza a un asesor humano por diseño. Una respuesta equivocada y segura sobre los ahorros de alguien sale mucho más cara que una lenta.',
        },
      },
    ],
    resultado: {
      en: 'Webhook verified and subscribed with the messaging provider, running in production on a permanent system token.',
      es: 'Webhook verificado y suscrito con el proveedor de mensajería, corriendo en producción con un token de sistema permanente.',
    },
    metricas: [
      { valor: '1', etiqueta: { en: 'serverless function, total', es: 'función serverless, en total' } },
      { valor: '2', etiqueta: { en: 'platforms deleted along the way', es: 'plataformas borradas en el camino' } },
    ],
    rol: {
      en: 'Sole developer — integration, prompt design and deployment.',
      es: 'Único desarrollador — integración, diseño del prompt y despliegue.',
    },
    stack: ['TypeScript', 'Vercel Functions', 'WhatsApp Cloud API', 'Claude API'],
    widget: 'chatbot',
    widgetTitulo: {
      en: 'Ask it something',
      es: 'Pregúntale algo',
    },
    widgetBajada: {
      en: 'The same FAQ routing that runs in production, minus the model call. Try asking about price — watch it refuse to answer and hand you to a human.',
      es: 'El mismo ruteo de FAQ que corre en producción, sin la llamada al modelo. Pregúntale por el precio — mira cómo se niega a contestar y te canaliza con un humano.',
    },
  },

  {
    // El nombre de la clienta va reservado hasta que ella lo autorice. Este
    // caso cuenta que su app tenía los expedientes de sus clientes expuestos:
    // aunque ya esté arreglado y aunque el arreglo sea mérito de Angel, el
    // riesgo reputacional es de ella, no de él. La historia técnica se cuenta
    // completa sin nombrarla, así que no se pierde nada.
    //
    // Para publicarla con nombre: cambiar slug a 'sandate', nombre a
    // 'Sandate Consultores' y quitar confidencial.
    slug: 'consultoria-financiera',
    nombre: {
      en: 'Client portal for a financial consultancy',
      es: 'Portal de clientes de una consultoría financiera',
    },
    cliente: {
      en: 'Financial consultancy (name withheld)',
      es: 'Consultoría financiera (nombre reservado)',
    },
    periodo: '2026',
    resumen: {
      en: 'Inherited a live client portal, opened the database, and found that anyone on the internet could read every client record and promote themselves to admin.',
      es: 'Heredé un portal de clientes en producción, abrí la base de datos y encontré que cualquiera en internet podía leer todos los expedientes y ascenderse a administrador.',
    },
    problema: {
      en: 'The app handles financial paperwork for real people — identity documents, case files, CVs. It is a pure client-side app talking straight to a hosted database with a public API key, which is a fine architecture right up until row-level security is off. It was off.',
      es: 'La app maneja trámites financieros de personas reales — identificaciones, expedientes, CVs. Es una app puramente de cliente que habla directo con una base hospedada usando una llave pública, que es una arquitectura perfectamente válida hasta el momento en que la seguridad a nivel de fila está apagada. Estaba apagada.',
    },
    decisiones: [
      {
        titulo: {
          en: 'Close the hole first, tell the story after',
          es: 'Cerrar el hoyo primero, contar la historia después',
        },
        detalle: {
          en: 'Row-level security on, policies written per role, and the privilege checks moved into database functions that run with elevated rights so a client cannot edit their own role field. Then verified from the outside as an anonymous user: no reads, no escalation.',
          es: 'Seguridad a nivel de fila encendida, políticas escritas por rol, y las verificaciones de privilegio movidas a funciones de base que corren con permisos elevados para que un cliente no pueda editar su propio campo de rol. Después verificado desde afuera como usuario anónimo: sin lecturas, sin escalación.',
        },
      },
      {
        titulo: {
          en: 'An advisor sees their clients. Not all clients.',
          es: 'Un asesor ve a sus clientes. No a todos.',
        },
        detalle: {
          en: 'The dashboard already filtered by advisor in the UI, which is not the same thing as being enforced. The policies now scope case files, documents and appointments to assigned clients at the database level — the UI filter became a convenience instead of the control.',
          es: 'El panel ya filtraba por asesor en la UI, que no es lo mismo que estar aplicado. Ahora las políticas acotan expedientes, documentos y citas a los clientes asignados a nivel de base — el filtro de la UI pasó de ser el control a ser una comodidad.',
        },
      },
      {
        titulo: {
          en: 'CVs stopped being public URLs',
          es: 'Los CVs dejaron de ser URLs públicas',
        },
        detalle: {
          en: 'Job applicants\' CVs sat in a publicly readable bucket. Now the bucket is staff-only and sharing one goes through a function that signs a 48-hour URL server-side — and only for paths that look like a generated identifier, so it cannot be turned into a file browser.',
          es: 'Los CVs de los candidatos vivían en un bucket de lectura pública. Ahora el bucket es solo para staff y compartir uno pasa por una función que firma una URL de 48 horas del lado del servidor — y solo para rutas con forma de identificador generado, para que no se pueda convertir en un explorador de archivos.',
        },
      },
    ],
    resultado: {
      en: 'Five security fixes shipped to production the same week, plus client notifications with realtime updates and a video library cut from 604 MB to 76 MB without touching audio or length.',
      es: 'Cinco correcciones de seguridad desplegadas a producción la misma semana, más notificaciones al cliente con actualizaciones en tiempo real y una videoteca reducida de 604 MB a 76 MB sin tocar audio ni duración.',
    },
    metricas: [
      { valor: '5', etiqueta: { en: 'security fixes shipped', es: 'correcciones de seguridad desplegadas' } },
      { valor: '87%', etiqueta: { en: 'smaller video library', es: 'menos peso en la videoteca' } },
      { valor: '48h', etiqueta: { en: 'signed URL lifetime', es: 'de vida en las URLs firmadas' } },
    ],
    rol: {
      en: 'Sole developer — security audit, remediation, feature work and deployment.',
      es: 'Único desarrollador — auditoría de seguridad, remediación, nuevas funciones y despliegue.',
    },
    stack: [
      'React',
      'Vite',
      'Supabase',
      'PostgreSQL',
      'Row Level Security',
      'Edge Functions',
      'WhatsApp Cloud API',
      'ffmpeg',
      'Vercel',
    ],
    widget: 'rls',
    widgetTitulo: {
      en: 'What an anonymous visitor could read',
      es: 'Lo que podía leer un visitante anónimo',
    },
    widgetBajada: {
      en: 'Flip the switch to see the same query run before and after the fix. Rows are fabricated — the query is not.',
      es: 'Mueve el switch para ver la misma consulta antes y después del arreglo. Las filas son inventadas — la consulta no.',
    },
    confidencial: true,
  },
]

export function proyectoPorSlug(slug: string | undefined): Proyecto | undefined {
  return proyectos.find((proyecto) => proyecto.slug === slug)
}
