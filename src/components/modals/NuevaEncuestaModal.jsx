import { useState, useEffect } from 'react';
import { InputField } from '../InputField';
import { Textarea } from '../Textarea';
import { Button } from '../Button';
import { DateField, TimeField } from '../ui/DateTimeFields';

function ArrowRightIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * NuevaEncuestaModal — Modal de creación de nueva encuesta.
 * Fuente: Figma 2q8xKT2K5Qu065dZvUuUNZ · nodo 1173:7581.
 *
 * Props:
 *   isOpen     — controla visibilidad
 *   onClose    — callback al cancelar o cerrar
 *   onSubmit   — callback con los datos del formulario al confirmar
 */
export default function NuevaEncuestaModal({ isOpen, onClose, onSubmit }) {
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [fechaTermino, setFechaTermino] = useState('');
  const [horaTermino, setHoraTermino] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!nombre.trim()) errs.nombre = 'El nombre no puede estar vacío.';
    if (!fechaInicio) errs.fechaInicio = 'Indica la fecha de inicio.';
    if (!horaInicio) errs.horaInicio = 'Indica la hora de inicio.';
    if (!fechaTermino) errs.fechaTermino = 'Indica la fecha de término.';
    if (!horaTermino) errs.horaTermino = 'Indica la hora de término.';
    if (fechaInicio && fechaTermino && fechaTermino < fechaInicio)
      errs.fechaTermino = 'La fecha de término debe ser posterior a la de inicio.';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit?.({ nombre, fechaInicio, horaInicio, fechaTermino, horaTermino, descripcion });
    handleClose();
  };

  const handleClose = () => {
    onClose?.();
    reset();
  };

  const reset = () => {
    setNombre('');
    setFechaInicio('');
    setHoraInicio('');
    setFechaTermino('');
    setHoraTermino('');
    setDescripcion('');
    setErrors({});
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-nueva-encuesta-title"
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0px 5px 8px 0px rgba(0, 0, 0, 0.15)',
          width: '754px',
          maxWidth: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          padding: '24px',
          boxSizing: 'border-box',
        }}
      >
        <h2
          id="modal-nueva-encuesta-title"
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '18px',
            fontWeight: 500,
            color: '#1E5591',
            textAlign: 'center',
            margin: 0,
            lineHeight: 1,
            width: '100%',
          }}
        >
          Nueva encuesta
        </h2>

        <div style={{
          background: '#EDF2F4',
          padding: '8px 16px',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
        }}>
          <p style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '12px',
            fontWeight: 400,
            color: '#333333',
            margin: 0,
            lineHeight: 1,
          }}>
            Comienza completando los datos básicos y luego continúa con el proceso general.
          </p>
        </div>

        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxSizing: 'border-box',
        }}>
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

          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <DateField
              label="Fecha de inicio *"
              value={fechaInicio}
              onChange={v => {
                setFechaInicio(v);
                setErrors(er => ({ ...er, fechaInicio: undefined, fechaTermino: undefined }));
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

          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
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

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
        }}>
          <Button variant="secondary" size="md" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            icon={<ArrowRightIcon />}
            iconPosition="right"
          >
            Crear nueva encuesta
          </Button>
        </div>
      </div>
    </div>
  );
}
