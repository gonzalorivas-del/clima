import { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import tokens from '../tokens/tokens.json';
import { Tabs } from '../components/Tabs';
import { CardOption } from '../components/CardOption';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { Textarea } from '../components/Textarea';
import { Uploader } from '../components/Uploader';
import { SidePanel } from '../components/SidePanel';
import { DateField, TimeField } from '../components/ui/DateTimeFields';
import arrowLeftSvg from '../assets/Arrow left.svg';
import homeSvg from '../assets/Home.svg';
import editSvg from '../assets/Edit.svg';
import trashSvg from '../assets/Trash.svg';
import moreSvg from '../assets/More.svg';

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

function horaToDisplay(hora) {
  if (!hora) return '';
  const [h, m] = hora.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
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




// ── NotificacionesStep ─────────────────────────────────────────────────────────
export default function NotificacionesStep() {
  const {
    encuestaActual, setView,
    notificaciones, setNotificaciones, eliminarNotificacion,
    surveyCompletedSteps, markSurveyStepComplete,
  } = useEvaluation();

  const wizardTabs = [
    { key: 'general',        label: 'General' },
    { key: 'notificaciones', label: 'Notificaciones' },
    { key: 'resumen',        label: 'Resumen', disabled: !surveyCompletedSteps.includes('notificaciones') },
  ];

  // ── Panel state ──────────────────────────────────────────────────────────────
  const [panelOpen,          setPanelOpen]          = useState(false);
  const [tipoPanel,          setTipoPanel]          = useState('invitacion');
  const [notificacionEditar, setNotificacionEditar] = useState(null);
  const [menuAbiertoId,      setMenuAbiertoId]      = useState(null);

  // ── Form state ───────────────────────────────────────────────────────────────
  const [asunto,          setAsunto]          = useState('');
  const [fechaProgramada, setFechaProgramada] = useState('');
  const [horaProgramada,  setHoraProgramada]  = useState('');
  const [cuerpo,          setCuerpo]          = useState('');
  const [bannerFile,      setBannerFile]      = useState(null);
  const [footerFile,      setFooterFile]      = useState(null);
  const [formErrors,      setFormErrors]      = useState({});

  // ── Breadcrumb data ──────────────────────────────────────────────────────────
  const nombre       = encuestaActual?.nombre       || 'Nueva encuesta';
  const fechaInicio  = encuestaActual?.fechaInicio  || '';
  const fechaTermino = encuestaActual?.fechaTermino || '';
  const dateRange    = (fechaInicio || fechaTermino)
    ? `${isoToDisplay(fechaInicio)} → ${isoToDisplay(fechaTermino)}`
    : '';

  // ── Panel handlers ───────────────────────────────────────────────────────────
  function abrirPanel(tipo) {
    setTipoPanel(tipo);
    setNotificacionEditar(null);
    setAsunto('');
    setFechaProgramada('');
    setHoraProgramada('');
    setCuerpo('');
    setBannerFile(null);
    setFooterFile(null);
    setFormErrors({});
    setPanelOpen(true);
  }

  function abrirPanelEditar(notif) {
    setTipoPanel(notif.tipo);
    setNotificacionEditar(notif);
    setAsunto(notif.asunto);
    setFechaProgramada(notif.fechaProgramada);
    setHoraProgramada(notif.horaProgramada);
    setCuerpo(notif.cuerpo);
    setBannerFile(notif.bannerFile || null);
    setFooterFile(notif.footerFile || null);
    setFormErrors({});
    setMenuAbiertoId(null);
    setPanelOpen(true);
  }

  function cerrarPanel() {
    setPanelOpen(false);
    setNotificacionEditar(null);
  }

  function handleGuardar() {
    const errs = {};
    if (!asunto.trim())   errs.asunto         = 'El asunto no puede estar vacío.';
    if (!fechaProgramada) errs.fechaProgramada = 'Indica la fecha programada.';
    if (!horaProgramada)  errs.horaProgramada  = 'Indica la hora programada.';
    if (!cuerpo.trim())   errs.cuerpo          = 'El cuerpo del mensaje no puede estar vacío.';
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }

    const data = {
      id:             notificacionEditar?.id || Date.now(),
      tipo:           tipoPanel,
      asunto,
      fechaProgramada,
      horaProgramada,
      cuerpo,
      bannerFile,
      footerFile,
    };

    setNotificaciones(prev => {
      const exists = prev.find(n => n.id === data.id);
      if (exists) return prev.map(n => n.id === data.id ? data : n);
      return [...prev, data];
    });

    cerrarPanel();
  }

  function toggleMenu(e, id) {
    e.stopPropagation();
    setMenuAbiertoId(prev => prev === id ? null : id);
  }

  function handleEliminar(id) {
    setMenuAbiertoId(null);
    eliminarNotificacion(id);
  }

  return (
    <div
      style={{ minHeight: '100vh', backgroundColor: C.fondo, fontFamily: 'Roboto, sans-serif', paddingBottom: 48 }}
      onClick={() => setMenuAbiertoId(null)}
    >
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
            aria-label="Volver al listado"
            onClick={e => { e.stopPropagation(); setView('list'); }}
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

        {/* Tabs */}
        <Tabs
          tabs={wizardTabs}
          activeKey="notificaciones"
          completedKeys={surveyCompletedSteps}
          variant="text"
          onTabClick={key => setView(key)}
        />

        {/* Section header */}
        <div style={{ width: '100%', maxWidth: 998, display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 32, boxSizing: 'border-box' }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: C.primario, lineHeight: '1.3' }}>
            Notificaciones
          </p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: C.panel, lineHeight: '20px' }}>
            Configura los correos de invitación y recordatorio para asegurar la participación de los colaboradores en esta encuesta.
          </p>
        </div>

        {/* Sección opciones + lista */}
        <div style={{
          width: '100%',
          maxWidth: 998,
          backgroundColor: C.blanco,
          borderRadius: 16,
          padding: 24,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>

          {/* Cards Invitación + Recordatorio */}
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <CardOption
                title="Invitación"
                subtitle=""
                description="Correo inicial para invitar al colaborador a participar."
                buttonLabel="Crear notificación"
                onButtonClick={() => abrirPanel('invitacion')}
              />
            </div>
            <div style={{ flex: 1 }}>
              <CardOption
                title="Recordatorio"
                subtitle=""
                description="Correo de seguimiento para quienes aún no responden."
                buttonLabel="Crear notificación"
                onButtonClick={() => abrirPanel('recordatorio')}
              />
            </div>
          </div>

          {/* Lista de notificaciones creadas */}
          {notificaciones.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 32, paddingRight: 16, paddingBottom: 16, paddingLeft: 16 }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: C.panel }}>
                Notificaciones actuales ({notificaciones.length})
              </p>

              {notificaciones.map(notif => (
                <div
                  key={notif.id}
                  style={{ position: 'relative', backgroundColor: C.blanco, borderRadius: 16, boxShadow: '0px 5px 4px rgba(0,0,0,0.15)', padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 16, fontWeight: 500, color: C.primOscuro }}>
                        {notif.tipo === 'invitacion' ? 'Invitación' : 'Recordatorio'}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', height: 24, padding: '0 8px', backgroundColor: '#B2E5FF', borderRadius: 16, fontSize: 14, fontWeight: 400, color: C.primario }}>
                        Activo
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label="Opciones de la notificación"
                      onClick={e => toggleMenu(e, notif.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                    >
                      <img src={moreSvg} width="24" height="24" alt="" aria-hidden="true" />
                    </button>
                  </div>

                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#333333', lineHeight: '20px' }}>
                    {notif.asunto}
                  </p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: '#666666', lineHeight: '20px' }}>
                    {notif.cuerpo}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 400, color: '#999999' }}>
                    {isoToDisplay(notif.fechaProgramada)} - {horaToDisplay(notif.horaProgramada)}
                  </p>

                  {/* Menú contextual */}
                  {menuAbiertoId === notif.id && (
                    <div
                      style={{ position: 'absolute', top: 48, right: 24, backgroundColor: C.blanco, borderRadius: 16, boxShadow: '0px 4px 16px rgba(0,0,0,0.15)', padding: 16, display: 'flex', flexDirection: 'column', gap: 16, zIndex: 100, minWidth: 187 }}
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => abrirPanelEditar(notif)}
                        style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, fontWeight: 400, color: '#333333', fontFamily: 'Roboto, sans-serif' }}
                      >
                        <img src={editSvg} width="24" height="24" alt="" aria-hidden="true" />
                        Editar notificación
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEliminar(notif.id)}
                        style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, fontWeight: 400, color: '#333333', fontFamily: 'Roboto, sans-serif' }}
                      >
                        <img src={trashSvg} width="24" height="24" alt="" aria-hidden="true" />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button variant="secondary" size="md" onClick={() => setView('list')}>
            Guardar borrador
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => { markSurveyStepComplete('notificaciones'); setView('resumen'); }}
            icon={<ArrowRightIcon />}
            iconPosition="right"
          >
            Guardar y continuar
          </Button>
        </div>
      </div>

      {/* ── SidePanel: formulario de notificación ──────────────────────── */}
      <SidePanel
        title={tipoPanel === 'invitacion' ? 'Invitación' : 'Recordatorio'}
        open={panelOpen}
        onClose={cerrarPanel}
      >
        {/* Asunto */}
        <InputField
          label="Asunto *"
          value={asunto}
          onChange={e => {
            setAsunto(e.target.value);
            setFormErrors(er => ({ ...er, asunto: undefined }));
          }}
          fieldState={formErrors.asunto ? 'error' : 'default'}
          supportingText={formErrors.asunto || ' '}
          hideIcon
        />

        {/* Fecha + Hora programada */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <DateField
            label="Fecha programada *"
            value={fechaProgramada}
            onChange={v => {
              setFechaProgramada(v);
              setFormErrors(er => ({ ...er, fechaProgramada: undefined }));
            }}
            error={!!formErrors.fechaProgramada}
            supportingText={formErrors.fechaProgramada}
          />
          <TimeField
            label="Hora programada *"
            value={horaProgramada}
            onChange={v => {
              setHoraProgramada(v);
              setFormErrors(er => ({ ...er, horaProgramada: undefined }));
            }}
            error={!!formErrors.horaProgramada}
            supportingText={formErrors.horaProgramada}
          />
        </div>

        {/* Cuerpo del mensaje */}
        <Textarea
          label="Cuerpo del mensaje"
          value={cuerpo}
          onChange={v => {
            setCuerpo(v);
            setFormErrors(er => ({ ...er, cuerpo: undefined }));
          }}
          fieldState={formErrors.cuerpo ? 'error' : 'default'}
          maxLength={2000}
          placeholder="Escribe el texto de invitación aquí"
        />

        {/* Correo de consultas deshabilitado */}
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
              description={[]}
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
              description={[]}
              file={footerFile}
              onFileChange={f => setFooterFile({ name: f.name, size: `${(f.size / 1048576).toFixed(1)} MB` })}
              onFileRemove={() => setFooterFile(null)}
              accept=".jpg,.jpeg,.png,.webp"
            />
          </div>
        </div>

        {/* Banner informativo */}
        <div style={{ backgroundColor: '#EDF2F4', borderRadius: 4, padding: '8px 16px' }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 400, color: '#333333', lineHeight: 'normal' }}>
            Asegúrate de utilizar archivos que no superen los 3 MB. Recomendaciones de imagen relación largo:alto 5:1 (ej: 1500 x 300 px)
          </p>
        </div>

        {/* Botones del panel */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 8 }}>
          <Button variant="secondary" size="md" onClick={cerrarPanel}>
            Cancelar
          </Button>
          <Button variant="primary" size="md" onClick={handleGuardar}>
            Guardar notificación
          </Button>
        </div>
      </SidePanel>
    </div>
  );
}
