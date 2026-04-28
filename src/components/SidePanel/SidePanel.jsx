import { createPortal } from 'react-dom';
import styles from './SidePanel.module.css';

function XIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="#00B4FF"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * SidePanel — Panel deslizable desde la derecha.
 * Fuente: Figma 2q8xKT2K5Qu065dZvUuUNZ · nodo 1177:9982
 *
 * @param {string}   title    — Título del panel (22px, medium, #5780AD)
 * @param {boolean}  open     — Controla visibilidad
 * @param {function} onClose  — Callback al cerrar (botón X o backdrop)
 * @param {ReactNode} children — Contenido del panel
 */
export function SidePanel({ title, open, onClose, children }) {
  if (!open) return null;

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.panel}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.header}>
          <p className={styles.title}>{title}</p>
          <button
            type="button"
            aria-label="Cerrar panel"
            onClick={onClose}
            className={styles.closeBtn}
          >
            <XIcon />
          </button>
        </div>

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
