import { useState } from 'react';
import NuevaEncuestaModal from '../components/modals/NuevaEncuestaModal';
import { Button } from '../components/Button';

/**
 * NuevaEncuestaPage — Vista que contiene el modal de creación de nueva encuesta.
 * El modal se abre por defecto para reflejar el flujo "Nuevo +" del megamenú.
 *
 * Paso 1 del wizard: General → Notificaciones → Resumen.
 */
export default function NuevaEncuestaPage() {
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (data) => {
    console.log('Nueva encuesta creada:', data);
    setIsOpen(false);
    // TODO: navegar al paso "General" del wizard con los datos recibidos
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F6F9FA',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Roboto, sans-serif',
    }}>
      {/* Estado cuando la modal está cerrada — solo para desarrollo */}
      {!isOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <p style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '16px',
            color: '#5780AD',
            margin: 0,
          }}>
            Modal cerrada
          </p>
          <Button variant="primary" onClick={() => setIsOpen(true)}>
            + Nuevo
          </Button>
        </div>
      )}

      <NuevaEncuestaModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
