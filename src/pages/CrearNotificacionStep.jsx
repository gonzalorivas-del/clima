import { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import tokens from '../tokens/tokens.json';
import { InputField } from '../components/InputField';
import { Textarea } from '../components/Textarea';
import { Button } from '../components/Button';
import { Uploader } from '../components/Uploader';
import { Tabs } from '../components/Tabs';
import { DateField, TimeField } from '../components/ui/DateTimeFields';
import arrowLeftSvg from '../assets/Arrow left.svg';
import homeSvg from '../assets/Home.svg';

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

// ── Wizard tabs ────────────────────────────────────────────────────────────────
const WIZARD_TABS = [
  { key: 'general',        label: 'General' },
  { key: 'notificaciones', label: 'Notificaciones' },
  { key: 'resumen',        label: 'Resumen', disabled: true },
];

// ── CrearNotificacionStep ──────────────────────────────────────────────────────
export default function CrearNotificacionStep() {
  const {
    encuestaActual, setView,
    tipoNotificacionActual, notificacionEditar,
    guardarNotificacion,
  } = useEvaluation();

  const nombre       = encuestaActual?.nombre       || 'Nueva encuesta';
  const fechaInicio  = encuestaActual?.fechaInicio  || '';
  const fechaTermino = encuestaActual?.fechaTermino || '';
  const dateRange    = (fechaInicio || fechaTermino)
    ? `${isoToDisplay(fechaInicio)} → ${isoToDisplay(fechaTermino)}`
    : '';

  const tipoLabel = tipoNotificacionActual === 'invitacion' ? 'Invitación' : 'Recordatorio';

  const [asunto,         setAsunto]         = useState(notificacionEditar?.asunto         || '');
  const [fechaProgramada, setFechaProgramada] = useState(notificacionEditar?.fechaProgramada || '');
  const [horaProgramada,  setHoraProgramada]  = useState(notificacionEditar?.horaProgramada  || '');
  const [cuerpo,          setCuerpo]          = useState(notificacionEditar?.cuerpo          || '');
  const [bannerFile,      setBannerFile]      = useState(notificacionEditar?.bannerFile      || null);
  const [footerFile,      setFooterFile]      = useState(notificacionEditar?.footerFile      || null);
  const [errors,          setErrors]          = useState({});

  function handleGuardar() {
    const errs = {};
    if (!asunto.trim())       errs.asunto         = 'El asunto no puede estar vacío.';
    if (!fechaProgramada)     errs.fechaProgramada = 'Indica la fecha programada.';
    if (!horaProgramada)      errs.horaProgramada  = 'Indica la hora programada.';
    if (!cuerpo.trim())       errs.cuerpo          = 'El cuerpo del mensaje no puede estar vacío.';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    guardarNotificacion({
      id:             notificacionEditar?.id || Date.now(),
      tipo:           tipoNotificacionActual,
      asunto,
      fechaProgramada,
      horaProgramada,
      cuerpo,
      bannerFile,
      footerFile,
    });
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.fondo, fontFamily: 'Roboto, sans-serif', paddingBottom: 48 }}>

      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <div style={{ margin: '0 60px', paddingTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 32, marginBottom: 4 }}>
          <img src={homeSvg} width="16" height="16" alt="" aria-hidden="true" />
          <span style={{ fontSize: 10, fontWeight: 400, color: C.grisOscuro, lineHeight: '16px' }}>
            / Evaluaciones /
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <button
            type="button"
            aria-label="Volver a notificaciones"
            onClick={() => setView('notificaciones')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}
          >
            <img src={arrowLeftSvg} width="32" height="32" alt="" aria-hidden="true" />
          </button>
          <h1 style={{ margin: 0, fontSize: 25, fontWeight: 500, color: C.primOscuro, lineHeight: '32px', whiteSpace: 'nowrap' }}>
            {nombre}
          </h1>
          <span style={{ display: 'inline-flex', alignItems: 'center', height: 24, padding: '0 8px', border: `2px solid ${C.importante}`, borderRadius: 16, fontSize: 14, fontWeight: 400, color: '#019BE5', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Borrador
          </span>
        </div>

        {dateRange && (
          <div style={{ paddingLeft: 32, fontSize: 14, fontWeight: 400, color: C.grisTextos, lineHeight: '20px' }}>
            {dateRange}
          </div>
        )}
      </div>

      {/* ── White container ────────────────────────────────────────────── */}
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

        {/* ── Tabs ──────────────────────────────────────────────────── */}
        <Tabs
          tabs={WIZARD_TABS}
          activeKey="notificaciones"
          completedKeys={['general']}
          variant="text"
        />

        {/* ── Section header ─────────────────────────────────────── */}
        <div style={{ width: '100%', maxWidth: 998, display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 32, boxSizing: 'border-box' }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: C.primario, lineHeight: '1.3' }}>
            Configuración de notificaciones
          </p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: C.panel, lineHeight: '20px' }}>
            Desde aquí puedes configurar y personalizar los textos, botones, e imágenes para las notificaciones de recordatorio de tu encuesta.
          </p>
        </div>

        {/* ── Form section ───────────────────────────────────────── */}
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
            {tipoLabel}
          </p>

          {/* Asunto */}
          <InputField
            label="Asunto *"
            value={asunto}
            onChange={e => {
              setAsunto(e.target.value);
              setErrors(er => ({ ...er, asunto: undefined }));
            }}
            fieldState={errors.asunto ? 'error' : 'default'}
            supportingText={errors.asunto || ' '}
            hideIcon
          />

          {/* Fecha y hora programada */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <DateField
              label="Fecha programada *"
              value={fechaProgramada}
              onChange={v => {
                setFechaProgramada(v);
                setErrors(er => ({ ...er, fechaProgramada: undefined }));
              }}
              error={!!errors.fechaProgramada}
              supportingText={errors.fechaProgramada}
            />
            <TimeField
              label="Hora programada *"
              value={horaProgramada}
              onChange={v => {
                setHoraProgramada(v);
                setErrors(er => ({ ...er, horaProgramada: undefined }));
              }}
              error={!!errors.horaProgramada}
              supportingText={errors.horaProgramada}
            />
          </div>

          {/* Cuerpo del mensaje */}
          <Textarea
            label="Cuerpo del mensaje"
            value={cuerpo}
            onChange={v => {
              setCuerpo(v);
              setErrors(er => ({ ...er, cuerpo: undefined }));
            }}
            fieldState={errors.cuerpo ? 'error' : 'default'}
            maxLength={2000}
            placeholder="Escribe el texto de invitación aquí"
          />

          {/* Correo electrónico de consultas (deshabilitado) */}
          <InputField
            label="Correo electrónico de consultas"
            value="rrhh@empresa.cl"
            onChange={() => {}}
            fieldState="disabled"
            hideIcon
          />

          {/* Foto banner + Foto footer */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: C.negroTextos }}>
                Foto banner
              </p>
              <Uploader
                hideHeader
                file={bannerFile}
                onFileChange={f => setBannerFile({ name: f.name, size: `${(f.size / 1048576).toFixed(1)} MB` })}
                onFileRemove={() => setBannerFile(null)}
                accept=".jpg,.jpeg,.png,.webp"
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: C.negroTextos }}>
                Foto footer
              </p>
              <Uploader
                hideHeader
                file={footerFile}
                onFileChange={f => setFooterFile({ name: f.name, size: `${(f.size / 1048576).toFixed(1)} MB` })}
                onFileRemove={() => setFooterFile(null)}
                accept=".jpg,.jpeg,.png,.webp"
              />
            </div>
          </div>

          {/* Banner informativo */}
          <div style={{ backgroundColor: '#EBF5FF', borderRadius: 8, padding: '12px 16px', borderLeft: `4px solid ${C.auxiliar}` }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 400, color: C.grisOscuro, lineHeight: '18px' }}>
              Asegúrate de utilizar archivos que no superen los 3 MB. Recomendaciones de imagen relación largo:alto 5:1 (ej: 1500 x 300 px)
            </p>
          </div>
        </div>

        {/* ── Action buttons ──────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button variant="secondary" size="md" onClick={() => setView('notificaciones')}>
            Cancelar
          </Button>
          <Button variant="primary" size="md" onClick={handleGuardar}>
            Guardar notificación
          </Button>
        </div>

      </div>
    </div>
  );
}
