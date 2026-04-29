import { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import tokens from '../tokens/tokens.json';
import { Tabs } from '../components/Tabs';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import arrowLeftSvg from '../assets/Arrow left.svg';
import homeSvg from '../assets/Home.svg';
import editSvg from '../assets/Edit.svg';
import checkFillSvg from '../assets/Check fill.svg';
import xSvg from '../assets/X.svg';
import alertPng from '../assets/Alert.png';

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
  exito:       tokens.colors.exito['$value'],
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

// ── Mock data ──────────────────────────────────────────────────────────────────
const MOCK_GRUPOS = [
  { id: 'clima', nombre: 'Clima', colaboradores: 16, segmentos: 8 },
  { id: 'pulso', nombre: 'Pulso', colaboradores: 8,  segmentos: 4 },
];

const MOCK_SEGMENTOS = {
  clima: [
    { id: 'c1', nombre: 'Segmento 1', descripcion: 'Valor 1, Valor 2, Valor 3, +6' },
    { id: 'c2', nombre: 'Segmento 2', descripcion: 'Valor 1, Valor 2, Valor 3, +6' },
    { id: 'c3', nombre: 'Segmento 3', descripcion: 'Valor 1, Valor 2, Valor 3, +6' },
    { id: 'c4', nombre: 'Segmento 4', descripcion: 'Valor 1, Valor 2, Valor 3, +6' },
    { id: 'c5', nombre: 'Segmento 5', descripcion: 'Valor 1, Valor 2, Valor 3, +6' },
    { id: 'c6', nombre: 'Segmento 6', descripcion: 'Valor 1, Valor 2, Valor 3, +6' },
    { id: 'c7', nombre: 'Segmento 7', descripcion: 'Valor 1, Valor 2, Valor 3, +6' },
    { id: 'c8', nombre: 'Segmento 8', descripcion: 'Valor 1, Valor 2, Valor 3, +6' },
  ],
  pulso: [
    { id: 'p1', nombre: 'Segmento 1', descripcion: 'Valor 1, Valor 2, Valor 3, +6' },
    { id: 'p2', nombre: 'Segmento 2', descripcion: 'Valor 1, Valor 2, Valor 3, +6' },
    { id: 'p3', nombre: 'Segmento 3', descripcion: 'Valor 1, Valor 2, Valor 3, +6' },
    { id: 'p4', nombre: 'Segmento 4', descripcion: 'Valor 1, Valor 2, Valor 3, +6' },
  ],
};

const MOCK_PLANTILLA = 'Encuesta ECI';

// ── Icons ──────────────────────────────────────────────────────────────────────
function ChevronDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckMarkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Shared styles ──────────────────────────────────────────────────────────────
const sectionCard = {
  backgroundColor: C.blanco,
  borderRadius: 16,
  boxShadow: '0px 5px 4px rgba(0,0,0,0.15)',
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  width: '100%',
  maxWidth: 998,
  boxSizing: 'border-box',
};

const editBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: '#019BE5',
  fontSize: 14,
  fontWeight: 500,
  fontFamily: 'Roboto, sans-serif',
  lineHeight: 1,
  flexShrink: 0,
};

const chipBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2px 8px',
  border: `1px solid ${C.auxiliar}`,
  borderRadius: 16,
  fontSize: 14,
  fontWeight: 500,
  color: C.negroTextos,
  whiteSpace: 'nowrap',
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionTitleRow({ title, onEdit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: C.panel }}>{title}</p>
      {onEdit && (
        <button type="button" onClick={onEdit} style={editBtnStyle}>
          <img src={editSvg} width="24" height="24" alt="" aria-hidden="true" />
          Editar
        </button>
      )}
    </div>
  );
}

function InfoField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 12, fontWeight: 400, color: C.grisTextos, lineHeight: 1 }}>{label}</span>
      <div style={{ fontSize: 14, fontWeight: 500, color: C.negroTextos, lineHeight: '20px' }}>
        {children}
      </div>
    </div>
  );
}

// ── SegmentoModal ──────────────────────────────────────────────────────────────
function SegmentoModal({ segmento, onClose }) {
  if (!segmento) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="segmento-modal-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.45)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.blanco,
          borderRadius: 16,
          boxShadow: '0px 5px 8px rgba(0,0,0,0.15)',
          width: 480,
          maxWidth: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: 24,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <h2
          id="segmento-modal-title"
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 500,
            color: C.primario,
            textAlign: 'center',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {segmento.nombre}
        </h2>
        <p style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 400,
          color: C.grisOscuro,
          lineHeight: '20px',
          fontFamily: 'Roboto, sans-serif',
        }}>
          {segmento.descripcion}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="secondary" size="md" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── GrupoCard (con tarjetas de segmento) ───────────────────────────────────────
function GrupoCard({ grupo, segmentos, expanded, onToggle, onVerMasSegmento }) {
  return (
    <div style={{
      backgroundColor: C.fondo,
      borderRadius: 16,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      alignItems: 'center',
    }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px 8px', borderRadius: 16,
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 16, fontWeight: 400, color: C.primario,
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        {grupo.nombre}
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>

      {expanded && (
        <>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
            <span style={chipBadgeStyle}>({grupo.colaboradores}) colaboradores participando</span>
            <span style={chipBadgeStyle}>({grupo.segmentos}) segmentos</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, width: '100%' }}>
            {segmentos.map(seg => (
              <div key={seg.id} style={{ flex: '1 0 calc(25% - 6px)', minWidth: 180 }}>
                <Card
                  variant="segment"
                  title={seg.nombre}
                  description={seg.descripcion}
                  onVerMas={() => onVerMasSegmento(seg)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── NotifCard ──────────────────────────────────────────────────────────────────
function NotifCard({ notif }) {
  const tipoLabel = notif.tipo === 'invitacion' ? 'Invitación' : 'Recordatorio';
  const fechaHora = notif.fechaProgramada
    ? `${isoToDisplay(notif.fechaProgramada)} - ${horaToDisplay(notif.horaProgramada)}`
    : '';

  return (
    <div style={{
      flex: 1,
      backgroundColor: C.fondo,
      borderRadius: 16,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: C.primOscuro }}>{tipoLabel}</p>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: C.negroTextos, lineHeight: '20px' }}>
        {notif.asunto}
      </p>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: C.grisOscuro, lineHeight: '20px' }}>
        {notif.cuerpo}
      </p>
      {fechaHora && (
        <p style={{ margin: 0, fontSize: 12, fontWeight: 400, color: C.grisTextos }}>
          {fechaHora}
        </p>
      )}
    </div>
  );
}

function EmptyNotifCard({ tipo }) {
  return (
    <div style={{
      flex: 1, backgroundColor: C.fondo, borderRadius: 16, padding: 16,
      display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80,
    }}>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: C.grisTextos }}>
        Sin {tipo.toLowerCase()} configurada
      </p>
    </div>
  );
}

// ── ResumenStep ────────────────────────────────────────────────────────────────
export default function ResumenStep() {
  const {
    encuestaActual, setView,
    notificaciones, addToast,
    surveyCompletedSteps,
  } = useEvaluation();

  const wizardTabs = [
    { key: 'general',        label: 'General' },
    { key: 'notificaciones', label: 'Notificaciones' },
    { key: 'resumen',        label: 'Resumen' },
  ];

  const nombre       = encuestaActual?.nombre       || 'Nueva encuesta';
  const fechaInicio  = encuestaActual?.fechaInicio  || '';
  const horaInicio   = encuestaActual?.horaInicio   || '';
  const fechaTermino = encuestaActual?.fechaTermino || '';
  const horaTermino  = encuestaActual?.horaTermino  || '';
  const dateRange    = (fechaInicio || fechaTermino)
    ? `${isoToDisplay(fechaInicio)} → ${isoToDisplay(fechaTermino)}`
    : '';

  const [gruposExpandidos,   setGruposExpandidos]   = useState(
    Object.fromEntries(MOCK_GRUPOS.map(g => [g.id, true]))
  );
  const [mostrarRestricciones, setMostrarRestricciones] = useState(true);
  const [segmentoSeleccionado, setSegmentoSeleccionado] = useState(null);

  const invitacion   = notificaciones.find(n => n.tipo === 'invitacion');
  const recordatorio = notificaciones.find(n => n.tipo === 'recordatorio');

  function toggleGrupo(id) {
    setGruposExpandidos(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function handleGuardarBorrador() {
    addToast('Borrador guardado correctamente.');
    setView('list');
  }

  function handleCrearEncuesta() {
    addToast('Encuesta creada exitosamente.');
    setView('list');
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.fondo, fontFamily: 'Roboto, sans-serif', paddingBottom: 48 }}>

      {/* ── Modal de segmento ──────────────────────────────────────────── */}
      <SegmentoModal
        segmento={segmentoSeleccionado}
        onClose={() => setSegmentoSeleccionado(null)}
      />

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
          tabs={wizardTabs}
          activeKey="resumen"
          completedKeys={surveyCompletedSteps}
          variant="text"
          onTabClick={key => setView(key)}
        />

        {/* ── Section header ─────────────────────────────────────── */}
        <div style={{ width: '100%', maxWidth: 998, display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 32, boxSizing: 'border-box' }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: C.primario, lineHeight: '1.3' }}>
            Resumen de la configuración
          </p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: C.panel, lineHeight: '20px' }}>
            Revisa la configuración completa antes de crear la encuesta.
          </p>
        </div>

        {/* ── SECCIÓN 1: Datos generales ─────────────────────────── */}
        <div style={sectionCard}>

          <SectionTitleRow title="Datos generales" onEdit={() => setView('general')} />

          <div style={{ border: `1px solid ${C.auxiliar}`, borderRadius: 16, display: 'flex', gap: 4 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
              <InfoField label="Nombre">{nombre || '—'}</InfoField>
              <InfoField label="Inicio">
                {fechaInicio ? `${isoToDisplay(fechaInicio)} ${horaToDisplay(horaInicio)}` : '—'}
              </InfoField>
              <InfoField label="Término">
                {fechaTermino ? `${isoToDisplay(fechaTermino)} ${horaToDisplay(horaTermino)}` : '—'}
              </InfoField>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
              <InfoField label="Encuestas">
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
                  {MOCK_GRUPOS.map(g => (
                    <span key={g.id} style={chipBadgeStyle}>{g.nombre}</span>
                  ))}
                </div>
              </InfoField>
              <InfoField label="Plantilla">{MOCK_PLANTILLA}</InfoField>
            </div>
          </div>

          <SectionTitleRow
            title={`Segmentos por encuesta (${MOCK_GRUPOS.length})`}
            onEdit={() => setView('general')}
          />

          {MOCK_GRUPOS.map(grupo => (
            <GrupoCard
              key={grupo.id}
              grupo={grupo}
              segmentos={MOCK_SEGMENTOS[grupo.id] || []}
              expanded={gruposExpandidos[grupo.id]}
              onToggle={() => toggleGrupo(grupo.id)}
              onVerMasSegmento={seg => setSegmentoSeleccionado(seg)}
            />
          ))}
        </div>

        {/* ── SECCIÓN 2: Archivo importado ───────────────────────── */}
        <div style={sectionCard}>

          <SectionTitleRow title="Archivo importado" onEdit={() => setView('general')} />

          <div style={{ backgroundColor: '#EDF2F4', padding: '8px 16px' }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 400, color: C.negroTextos, lineHeight: '1.3', fontFamily: 'Roboto, sans-serif' }}>
              <strong>{'nóminaGeneral.xls  - (8)'}</strong>{' colaboradores'}
            </p>
          </div>
        </div>

        {/* ── SECCIÓN 3: Notificaciones configuradas ─────────────── */}
        <div style={sectionCard}>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: C.panel }}>
                Notificaciones configuradas
              </p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: C.panel, lineHeight: '20px' }}>
                Al guardar el proceso se enviarán las siguientes notificaciones.
              </p>
            </div>
            <button type="button" onClick={() => setView('notificaciones')} style={editBtnStyle}>
              <img src={editSvg} width="24" height="24" alt="" aria-hidden="true" />
              Editar
            </button>
          </div>

          <div style={{ display: 'flex', gap: 24 }}>
            {invitacion  ? <NotifCard notif={invitacion} />  : <EmptyNotifCard tipo="Invitación" />}
            {recordatorio ? <NotifCard notif={recordatorio} /> : <EmptyNotifCard tipo="Recordatorio" />}
          </div>
        </div>

        {/* ── SECCIÓN 4: Restricciones + CTAs ───────────────────── */}
        <div style={{ ...sectionCard, alignItems: 'center' }}>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
            <img src={alertPng} width="24" height="24" alt="" aria-hidden="true" />
            <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: C.panel }}>
              Una vez creado, algunos parámetros no podrán modificarse
            </p>
          </div>

          <div style={{ width: '100%' }}>
            <Chip
              label={mostrarRestricciones ? 'Ocultar' : 'Ver más'}
              expanded={mostrarRestricciones}
              onClick={() => setMostrarRestricciones(v => !v)}
            />
          </div>

          {mostrarRestricciones && (
            <div style={{
              border: `1px solid ${C.auxiliar}`, borderRadius: 16, padding: '8px 16px',
              display: 'flex', gap: 4, width: '100%', boxSizing: 'border-box',
            }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <img src={checkFillSvg} width="24" height="24" alt="" aria-hidden="true" />
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: C.negroTextos }}>
                    Editable después de activar:
                  </p>
                </div>
                <ul style={{ margin: 0, paddingLeft: 53, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li style={{ fontSize: 14, fontWeight: 400, color: C.grisOscuro, lineHeight: '20px' }}>Datos generales</li>
                  <li style={{ fontSize: 14, fontWeight: 400, color: C.grisOscuro, lineHeight: '20px' }}>Archivo importado</li>
                  <li style={{ fontSize: 14, fontWeight: 400, color: C.grisOscuro, lineHeight: '20px' }}>Noticias</li>
                  <li style={{ fontSize: 14, fontWeight: 400, color: C.grisOscuro, lineHeight: '20px' }}>Segmentos</li>
                </ul>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <img src={xSvg} width="24" height="24" alt="" aria-hidden="true" />
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: C.negroTextos }}>
                    No editable después de activar o guardar:
                  </p>
                </div>
                <ul style={{ margin: 0, paddingLeft: 53, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li style={{ fontSize: 14, fontWeight: 400, color: C.grisOscuro, lineHeight: '20px' }}>Agregar encuestas</li>
                  <li style={{ fontSize: 14, fontWeight: 400, color: C.grisOscuro, lineHeight: '20px' }}>Agregar/eliminar preguntas de plantilla relacionada(s)</li>
                </ul>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Button variant="secondary" size="md" onClick={handleGuardarBorrador}>
              Guardar como borrador
            </Button>
            <button
              type="button"
              onClick={handleCrearEncuesta}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', backgroundColor: C.exito,
                border: 'none', borderRadius: 24, cursor: 'pointer',
                fontSize: 16, fontWeight: 500, color: C.primario,
                fontFamily: 'Roboto, sans-serif', lineHeight: 1,
              }}
            >
              Crear encuesta
              <CheckMarkIcon />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
