import { useState } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import tokens from '../tokens/tokens.json';
import { Tabs } from '../components/Tabs';
import { Button } from '../components/Button';
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
  { id: 'clima', nombre: 'Clima', colaboradores: 8, segmentos: 5 },
  { id: 'pulso', nombre: 'Pulso', colaboradores: 8, segmentos: 5 },
];
const MOCK_PARTICIPANTES = 8;
const MOCK_PLANTILLA = 'Encuesta ECI';

const GRUPOS_COLUMNS = [
  { key: 'edad',      label: 'Edad',      count: 3 },
  { key: 'area',      label: 'Área',      count: 3 },
  { key: 'segmento1', label: 'Segmento 1' },
  { key: 'segmento2', label: 'Segmento 2' },
  { key: 'segmento3', label: 'Segmento 3' },
  { key: 'segmento4', label: 'Segmento 4' },
];

const GRUPOS_ROWS = [
  { id: 1, edad: 'De 42 a 50',  area: 'RRHH',       segmento1: 'Value 1', segmento2: 'Val A', segmento3: 'Val X', segmento4: 'Dato 1' },
  { id: 2, edad: 'De 51 a 65',  area: 'Diseño',      segmento1: 'Value 2', segmento2: 'Val B', segmento3: 'Val Y', segmento4: 'Dato 2' },
  { id: 3, edad: 'De 65 o más', area: 'Informática', segmento1: 'Value 3', segmento2: 'Val C', segmento3: 'Val Z', segmento4: 'Dato 3' },
];
const GRUPOS_TOTAL = 4;

const PARTICIPANTES_COLS = [
  { key: 'id',        label: 'Identificador nacional', fixed: true },
  { key: 'nombre',    label: 'Nombre' },
  { key: 'encuesta',  label: 'Encuesta' },
  { key: 'edad',      label: 'Edad' },
  { key: 'area',      label: 'Area' },
  { key: 'segmento1', label: 'Segmento 1' },
];

const PARTICIPANTES_ROWS = [
  { id: '11111111-1', nombre: 'María González',   encuesta: 'Clima', edad: 'De 42 a 50',  area: 'Desarrollo', segmento1: 'Value 1' },
  { id: '11111111-1', nombre: 'Juan Pérez',        encuesta: 'Clima', edad: 'De 42 a 50',  area: 'Desarrollo', segmento1: 'Value 2' },
  { id: '11111111-1', nombre: 'Ana López',         encuesta: 'Clima', edad: 'De 42 a 50',  area: 'Desarrollo', segmento1: 'Value 3' },
  { id: '11111111-1', nombre: 'Carlos Rodríguez',  encuesta: 'Clima', edad: 'De 51 a 65',  area: 'Desarrollo', segmento1: 'Value 4' },
  { id: '11111111-1', nombre: 'Sofía Martínez',    encuesta: 'Clima', edad: 'De 51 a 65',  area: 'Desarrollo', segmento1: 'Value 5' },
  { id: '11111111-1', nombre: 'Pedro Castillo',    encuesta: 'Clima', edad: 'De 51 a 65',  area: 'Desarrollo', segmento1: 'Value 6' },
  { id: '11111111-1', nombre: 'Laura Figueroa',    encuesta: 'Clima', edad: 'De 65 o más', area: 'Desarrollo', segmento1: 'Value 7' },
  { id: '11111111-1', nombre: 'Diego Morales',     encuesta: 'Clima', edad: 'De 65 o más', area: 'Desarrollo', segmento1: 'Value 8' },
];

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

function SortIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M12 19V5M7 10L12 5L17 10" stroke={C.auxiliar} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="11" cy="11" r="7" stroke="#B6CEE7" strokeWidth="1.5" />
      <path d="M16.5 16.5L21 21" stroke="#B6CEE7" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownSmall() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10 13L16 19L22 13" stroke={C.grisOscuro} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PaginatorPrev() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18L9 12L15 6" stroke={C.grisOscuro} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PaginatorNext() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6L15 12L9 18" stroke={C.grisOscuro} strokeWidth="1.5"
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

// ── Tabla Grupos ───────────────────────────────────────────────────────────────
function GrupoTabla() {
  return (
    <div style={{ width: '100%', overflowX: 'auto', borderRadius: 8 }}>
      <table style={{
        width: '100%',
        minWidth: 680,
        borderCollapse: 'collapse',
        fontFamily: 'Roboto, sans-serif',
        backgroundColor: C.blanco,
      }}>
        <thead>
          <tr>
            {GRUPOS_COLUMNS.map(col => (
              <th key={col.key} style={{
                padding: '8px 12px',
                backgroundColor: '#EDF2F4',
                fontSize: 12,
                fontWeight: 500,
                color: C.negroTextos,
                textAlign: 'left',
                whiteSpace: 'nowrap',
              }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {col.count !== undefined ? `${col.label} (${col.count})` : col.label}
                  <SortIcon />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GRUPOS_ROWS.map((row, i) => (
            <tr key={row.id}>
              {GRUPOS_COLUMNS.map(col => (
                <td key={col.key} style={{
                  padding: '8px 12px',
                  fontSize: 14,
                  fontWeight: 400,
                  color: C.negroTextos,
                  borderBottom: i < GRUPOS_ROWS.length - 1 ? `1px solid ${C.auxiliar}` : 'none',
                  whiteSpace: 'nowrap',
                }}>
                  {String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={GRUPOS_COLUMNS.length} style={{
              padding: '8px 12px',
              fontSize: 12,
              fontWeight: 400,
              color: C.grisTextos,
              borderTop: `1px solid ${C.auxiliar}`,
            }}>
              Total ({GRUPOS_TOTAL})
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ── GrupoCard ──────────────────────────────────────────────────────────────────
function GrupoCard({ grupo, expanded, onToggle }) {
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
          <GrupoTabla />
        </>
      )}
    </div>
  );
}

// ── Tabla Participantes ────────────────────────────────────────────────────────
function ParticipantesTabla() {
  const rowBorder = `1px solid ${C.auxiliar}`;

  const headerCellStyle = {
    backgroundColor: C.blanco,
    borderBottom: rowBorder,
    display: 'flex',
    gap: 4,
    alignItems: 'center',
    padding: '8px 4px 12px 8px',
    flexShrink: 0,
    width: '100%',
    boxSizing: 'border-box',
  };

  const bodyCellStyle = (isLast) => ({
    backgroundColor: C.blanco,
    borderBottom: isLast ? 'none' : rowBorder,
    display: 'flex',
    alignItems: 'center',
    height: 48,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 40,
    paddingRight: 8,
    flexShrink: 0,
    width: '100%',
    boxSizing: 'border-box',
  });

  const colFixed = {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  };

  const colFlex = {
    flex: '1 0 0',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  };

  const cellText = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 14,
    fontWeight: 400,
    color: C.negroTextos,
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: '1 0 0',
    minWidth: 0,
  };

  const headerText = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 14,
    fontWeight: 500,
    color: '#000000',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  };

  return (
    <div style={{
      backgroundColor: C.blanco,
      borderRadius: 16,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
    }}>

      {/* ── Search header ── */}
      <div style={{
        backgroundColor: C.blanco,
        height: 66,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px 0 8px',
        flexShrink: 0,
        borderRadius: '16px 16px 0 0',
      }}>
        {/* Left area (checkbox placeholder) */}
        <div style={{ width: 48, height: 44 }} />

        {/* Search input */}
        <div style={{
          width: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 8,
          paddingTop: 8,
          borderBottom: `1px solid ${C.auxiliar}`,
        }}>
          <span style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 16,
            fontWeight: 400,
            color: '#CCCCCC',
            lineHeight: 1.3,
          }}>
            Buscar contenido
          </span>
          <SearchIcon />
        </div>
      </div>

      {/* ── Columns ── */}
      <div style={{ display: 'flex', width: '100%', flexShrink: 0 }}>
        {PARTICIPANTES_COLS.map((col, colIdx) => (
          <div key={col.key} style={col.fixed ? colFixed : colFlex}>
            {/* Header */}
            <div style={headerCellStyle}>
              <SortIcon />
              <span style={headerText}>{col.label}</span>
            </div>
            {/* Cells */}
            {PARTICIPANTES_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} style={bodyCellStyle(rowIdx === PARTICIPANTES_ROWS.length - 1)}>
                <span style={cellText}>{row[col.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div style={{
        backgroundColor: C.blanco,
        display: 'flex',
        alignItems: 'center',
        borderRadius: '0 0 16px 16px',
        flexShrink: 0,
      }}>
        {/* Total */}
        <div style={{ flex: '1 0 0', minWidth: 0, padding: '12px 24px' }}>
          <p style={{
            margin: 0,
            fontFamily: 'Roboto, sans-serif',
            fontSize: 12,
            fontWeight: 500,
            color: C.grisTextos,
          }}>
            {`Total de {XXX} : 299`}
          </p>
        </div>

        {/* Paginador */}
        <div style={{
          flex: '1 0 0',
          minWidth: 0,
          height: 69,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 24,
          gap: 16,
        }}>
          {/* Filas label */}
          <span style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 16,
            fontWeight: 400,
            color: C.negroTextos,
            whiteSpace: 'nowrap',
          }}>
            Filas
          </span>

          {/* Row count selector */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 83,
            height: 69,
            gap: 4,
          }}>
            <span style={{ height: 16, fontSize: 12, color: C.grisTextos }}> </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                flex: 1,
                fontFamily: 'Roboto, sans-serif',
                fontSize: 16,
                fontWeight: 400,
                color: C.negroTextos,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                8
              </span>
              <ChevronDownSmall />
            </div>
            <div style={{ height: 1, backgroundColor: C.auxiliar }} />
            <span style={{ height: 16, fontSize: 12, color: C.grisTextos }}> </span>
          </div>

          {/* Page navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 296, flexShrink: 0 }}>
            <PaginatorPrev />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} style={{
                  width: 24, height: 24, padding: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: 14,
                    fontWeight: 400,
                    color: n === 1 ? C.importante : C.negroTextos,
                    lineHeight: '24px',
                    whiteSpace: 'nowrap',
                  }}>
                    {n}
                  </span>
                </div>
              ))}
              <div style={{ width: 24, height: 24, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, color: C.negroTextos }}>...</span>
              </div>
              <div style={{ width: 24, height: 24, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, color: C.negroTextos }}>20</span>
              </div>
            </div>

            <PaginatorNext />
          </div>
        </div>
      </div>
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

// ── Wizard tabs ────────────────────────────────────────────────────────────────
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

  const [gruposExpandidos,     setGruposExpandidos]     = useState(
    Object.fromEntries(MOCK_GRUPOS.map(g => [g.id, true]))
  );
  const [mostrarParticipantes, setMostrarParticipantes] = useState(false);
  const [mostrarRestricciones, setMostrarRestricciones] = useState(true);

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
              <InfoField label="Grupos">
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
            title={`Grupos (${MOCK_GRUPOS.length})`}
            onEdit={() => setView('general')}
          />

          {MOCK_GRUPOS.map(grupo => (
            <GrupoCard
              key={grupo.id}
              grupo={grupo}
              expanded={gruposExpandidos[grupo.id]}
              onToggle={() => toggleGrupo(grupo.id)}
            />
          ))}
        </div>

        {/* ── SECCIÓN 2: Participantes ───────────────────────────── */}
        <div style={sectionCard}>

          <SectionTitleRow title="Participantes" />

          <div style={{ backgroundColor: '#EDF2F4', padding: '8px 16px', borderRadius: 4 }}>
            <p style={{ margin: 0, fontSize: 12, color: C.negroTextos }}>
              <strong>({MOCK_PARTICIPANTES})</strong> colaboradores
            </p>
          </div>

          {/* Chip con ancho según contenido */}
          <div style={{ alignSelf: 'flex-start' }}>
            <Chip
              label={mostrarParticipantes ? 'Ocultar lista' : 'Ver lista completa'}
              expanded={mostrarParticipantes}
              onClick={() => setMostrarParticipantes(v => !v)}
            />
          </div>

          {mostrarParticipantes && <ParticipantesTabla />}
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
              Una vez activado, algunos parámetros no podrán modificarse
            </p>
          </div>

          {/* Chip con ancho según contenido */}
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
                  <li style={{ fontSize: 14, fontWeight: 400, color: C.grisOscuro, lineHeight: '20px' }}>Notificaciones</li>
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
                  <li style={{ fontSize: 14, fontWeight: 400, color: C.grisOscuro, lineHeight: '20px' }}>Participantes</li>
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
