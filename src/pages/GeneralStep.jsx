import { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import tokens from '../tokens/tokens.json';
import { InputField } from '../components/InputField';
import { Textarea } from '../components/Textarea';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { Uploader } from '../components/Uploader';
import { Tabs } from '../components/Tabs';
import { Selector } from '../components/Selector';
import { DateField, TimeField } from '../components/ui/DateTimeFields';
import arrowLeftSvg from '../assets/Arrow left.svg';
import homeSvg from '../assets/Home.svg';
import syncSvg from '../assets/Sync.svg';

// ── Token shortcuts ────────────────────────────────────────────────────────────
const C = {
  primario:    tokens.colors.primario['$value'],
  primOscuro:  tokens.colors['primario-oscuro']['$value'],
  panel:       tokens.colors.panel['$value'],
  importante:  tokens.colors.importante['$value'],
  auxiliar:    tokens.colors.auxiliar['$value'],
  fondo:       tokens.colors.fondo['$value'],
  grisTextos:  tokens.colors['gris-textos']['$value'],
  grisOscuro:  tokens.colors['gris-oscuro']['$value'],
  negroTextos: tokens.colors['negro-textos']['$value'],
  blanco:      tokens.colors.blanco['$value'],
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function isoToDisplay(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// ── Icons ──────────────────────────────────────────────────────────────────────

function ArrowRightIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Separator ──────────────────────────────────────────────────────────────────
function Separator() {
  return <div style={{ height: 1, backgroundColor: C.auxiliar, width: '100%' }} />;
}

// ── ECI template options ───────────────────────────────────────────────────────
const ECI_OPTIONS = [
  { value: 'eci-2024', label: 'ECI 2024' },
  { value: 'eci-2025', label: 'ECI 2025' },
  { value: 'eci-clima', label: 'ECI Clima Laboral' },
];


// ── GeneralStep ────────────────────────────────────────────────────────────────

export default function GeneralStep() {
  const { encuestaActual, setView, abrirNotificaciones, surveyCompletedSteps, markSurveyStepComplete } = useEvaluation();

  const wizardTabs = [
    { key: 'general',        label: 'General' },
    { key: 'notificaciones', label: 'Notificaciones', disabled: !surveyCompletedSteps.includes('general') },
    { key: 'resumen',        label: 'Resumen',        disabled: !surveyCompletedSteps.includes('notificaciones') },
  ];

  const [nombre,       setNombre]       = useState(encuestaActual?.nombre       || '');
  const [fechaInicio,  setFechaInicio]  = useState(encuestaActual?.fechaInicio  || '');
  const [horaInicio,   setHoraInicio]   = useState(encuestaActual?.horaInicio   || '');
  const [fechaTermino, setFechaTermino] = useState(encuestaActual?.fechaTermino || '');
  const [horaTermino,  setHoraTermino]  = useState(encuestaActual?.horaTermino  || '');
  const [descripcion,  setDescripcion]  = useState(encuestaActual?.descripcion  || '');
  const [usaECI,       setUsaECI]       = useState(false);
  const [plantillaECI, setPlantillaECI] = useState('');
  const [file,         setFile]         = useState(null);
  const [errors,       setErrors]       = useState({});

  const dateRange = (fechaInicio || fechaTermino)
    ? `${isoToDisplay(fechaInicio)} → ${isoToDisplay(fechaTermino)}`
    : '';

  function handleGuardarBorrador() {
    setView('list');
  }

  function handleGuardarContinuar() {
    const errs = {};
    if (!nombre.trim()) errs.nombre = 'El nombre no puede estar vacío.';
    if (!fechaInicio)   errs.fechaInicio  = 'Indica la fecha de inicio.';
    if (!horaInicio)    errs.horaInicio   = 'Indica la hora de inicio.';
    if (!fechaTermino)  errs.fechaTermino = 'Indica la fecha de término.';
    if (!horaTermino)   errs.horaTermino  = 'Indica la hora de término.';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    markSurveyStepComplete('general');
    abrirNotificaciones();
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: C.fondo,
      fontFamily: 'Roboto, sans-serif',
      paddingBottom: 48,
    }}>

      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <div style={{ margin: '0 60px', paddingTop: 24 }}>

        {/* Line 1: home icon + / Evaluaciones / */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          paddingLeft: 32,
          marginBottom: 4,
        }}>
          <img src={homeSvg} width="16" height="16" alt="" aria-hidden="true" />
          <span style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 10,
            fontWeight: 400,
            color: C.grisOscuro,
            lineHeight: '16px',
          }}>
            / Evaluaciones /
          </span>
        </div>

        {/* Line 2: back arrow + survey title + badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 4,
        }}>
          <button
            type="button"
            aria-label="Volver al listado"
            onClick={() => setView('list')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <img src={arrowLeftSvg} width="32" height="32" alt="" aria-hidden="true" />
          </button>

          <h1 style={{
            margin: 0,
            fontFamily: 'Roboto, sans-serif',
            fontSize: 25,
            fontWeight: 500,
            color: C.primOscuro,
            lineHeight: '32px',
            whiteSpace: 'nowrap',
          }}>
            {nombre || 'Nueva encuesta'}
          </h1>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 24,
            padding: '0 8px',
            border: `2px solid ${C.importante}`,
            borderRadius: 16,
            fontFamily: 'Roboto, sans-serif',
            fontSize: 14,
            fontWeight: 400,
            color: '#019BE5',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            Borrador
          </span>
        </div>

        {/* Line 3: date range */}
        {dateRange && (
          <div style={{
            paddingLeft: 32,
            fontFamily: 'Roboto, sans-serif',
            fontSize: 14,
            fontWeight: 400,
            color: C.grisTextos,
            lineHeight: '20px',
          }}>
            {dateRange}
          </div>
        )}
      </div>

      {/* ── White container ───────────────────────────────────────────────── */}
      <div style={{
        margin: '24px 60px 0',
        backgroundColor: C.blanco,
        borderRadius: 16,
        boxShadow: '0px 2px 2px rgba(0,0,0,0.15)',
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
        boxSizing: 'border-box',
      }}>

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <Tabs
          tabs={wizardTabs}
          activeKey="general"
          completedKeys={surveyCompletedSteps}
          variant="text"
          onTabClick={key => setView(key)}
        />

        {/* ── Section header ────────────────────────────────────────────── */}
        <div style={{
          width: '100%',
          maxWidth: 998,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          paddingLeft: 32,
          boxSizing: 'border-box',
        }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: C.primario, lineHeight: '1.3' }}>
            Información general
          </p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: C.panel, lineHeight: '20px' }}>
            Información básica sobre esta encuesta.
          </p>
        </div>

        {/* ── Sección 1: Sobre la encuesta ──────────────────────────────── */}
        <div style={{
          width: '100%',
          maxWidth: 998,
          backgroundColor: C.blanco,
          borderRadius: 16,
          boxShadow: '0px 5px 4px rgba(0,0,0,0.15)',
          padding: 24,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: C.panel }}>
            Sobre la encuesta
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <InputField
              label="Nombre de grupo encuesta *"
              value={nombre}
              onChange={e => {
                setNombre(e.target.value);
                setErrors(er => ({ ...er, nombre: undefined }));
              }}
              fieldState={errors.nombre ? 'error' : 'default'}
              supportingText={errors.nombre || ' '}
              hideIcon
            />

            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <DateField
                label="Fecha de inicio *"
                value={fechaInicio}
                onChange={v => {
                  setFechaInicio(v);
                  setErrors(er => ({ ...er, fechaInicio: undefined }));
                }}
                error={!!errors.fechaInicio}
                supportingText={errors.fechaInicio}
              />
              <TimeField
                label="Hora de inicio *"
                value={horaInicio}
                onChange={v => {
                  setHoraInicio(v);
                  setErrors(er => ({ ...er, horaInicio: undefined }));
                }}
                error={!!errors.horaInicio}
                supportingText={errors.horaInicio}
              />
            </div>

            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <DateField
                label="Fecha de término *"
                value={fechaTermino}
                onChange={v => {
                  setFechaTermino(v);
                  setErrors(er => ({ ...er, fechaTermino: undefined }));
                }}
                error={!!errors.fechaTermino}
                supportingText={errors.fechaTermino}
              />
              <TimeField
                label="Hora de término *"
                value={horaTermino}
                onChange={v => {
                  setHoraTermino(v);
                  setErrors(er => ({ ...er, horaTermino: undefined }));
                }}
                error={!!errors.horaTermino}
                supportingText={errors.horaTermino}
              />
            </div>

            <Textarea
              label="Descripción"
              value={descripcion}
              onChange={v => setDescripcion(v)}
              maxLength={1000}
              placeholder="Describe el objetivo de esta encuesta..."
            />
          </div>
        </div>

        {/* ── Sección 2: ¿Quiénes participan? ──────────────────────────── */}
        <div style={{
          width: '100%',
          maxWidth: 998,
          backgroundColor: C.blanco,
          borderRadius: 16,
          boxShadow: '0px 5px 4px rgba(0,0,0,0.15)',
          padding: 24,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: C.panel }}>
            ¿Quiénes participan?
          </p>

          {/* Plantilla encuesta */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: C.negroTextos, lineHeight: '20px' }}>
              Plantilla encuesta
            </p>
            {/* Fila: checkbox + selector condicional */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Checkbox
                  label="Encuesta ECI"
                  checked={usaECI}
                  onChange={v => {
                    setUsaECI(v);
                    if (!v) setPlantillaECI('');
                  }}
                />
                <p style={{ margin: 0, paddingLeft: 32, fontSize: 12, color: C.grisOscuro }}>
                  Indica si utilizarás una plantilla de Encuesta de Clima Interno
                </p>
              </div>

              {usaECI && (
                <Selector
                  label="Plantilla ECI"
                  placeholder="-- Seleccionar --"
                  options={ECI_OPTIONS}
                  value={plantillaECI}
                  onChange={setPlantillaECI}
                  style={{ width: 234, flexShrink: 0 }}
                />
              )}
            </div>
          </div>

          <Separator />

          {/* Importar desde Excel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: C.negroTextos, lineHeight: '20px' }}>
              Importar desde Excel
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ margin: 0, fontSize: 12, color: C.grisOscuro }}>
                Sube un archivo .xlsx con la lista de colaboradores a invitar.
              </p>
              <div style={{ maxWidth: 687 }}>
                <Uploader
                  title="Formato esperado del archivo"
                  description={[
                    'Puedes cargar los datos a una plantilla base predefinida.',
                    'Descárgala desde el botón "Descargar plantilla", edita lo que necesites y luego impórtala aquí para continuar.',
                  ]}
                  supportText="Excel XLS o CSV / 5mb máximo."
                  accept=".xlsx,.xls,.csv"
                  file={file}
                  onFileChange={f => setFile({ name: f.name, size: `${(f.size / 1048576).toFixed(1)} MB` })}
                  onFileRemove={() => setFile(null)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Sincronizar con Remuneraciones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: C.negroTextos, lineHeight: '20px' }}>
              Sincronizar con Remuneraciones
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ margin: 0, fontSize: 12, color: C.grisOscuro }}>
                Sincroniza con Rex+ Remuneraciones para descargar la nómina de colaboradores en formato Excel.
              </p>
              <p style={{ margin: 0, fontSize: 12, color: C.grisOscuro }}>
                Luego, cárgala usando el importador.
              </p>
              <Button
                variant="secondary"
                size="md"
                icon={<img src={syncSvg} width="24" height="24" alt="" aria-hidden="true" />}
                iconPosition="left"
                style={{ alignSelf: 'flex-start', height: 36 }}
              >
                Sincronizar con Remuneraciones
              </Button>
            </div>
          </div>
        </div>

        {/* ── Action buttons ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button variant="secondary" size="md" onClick={handleGuardarBorrador}>
            Guardar borrador
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleGuardarContinuar}
            icon={<ArrowRightIcon />}
            iconPosition="right"
          >
            Guardar y continuar
          </Button>
        </div>

      </div>
    </div>
  );
}
