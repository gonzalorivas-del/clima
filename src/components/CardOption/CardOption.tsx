import React from 'react';
import styles from './CardOption.module.css';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface CardOptionProps {
  /**
   * Texto en negrita a la izquierda del guión (ej: "90°", "180°").
   * Se renderiza con color primario-oscuro.
   */
  title: string;
  /**
   * Texto a la derecha del guión (ej: "Evaluación directa", "La más usada").
   * Se renderiza con color panel.
   */
  subtitle: string;
  /** Descripción del tipo de evaluación mostrada debajo del título. */
  description: string;
  /**
   * Muestra el badge "Recomendada" junto al título.
   * Mapea a las variantes WBadge y WBadge-Actived del diseño Figma.
   * Default: false
   */
  recommended?: boolean;
  /** Texto del badge. Default: 'Recomendada' */
  recommendedLabel?: string;
  /**
   * Estado seleccionado — añade borde `importante` (#00B4FF) y muestra
   * el indicador "✓ Seleccionada" en la parte inferior.
   * Mapea a la variante WBadge-Actived del diseño Figma.
   * Default: false
   */
  selected?: boolean;
  /** Texto del indicador de selección. Default: 'Seleccionada' */
  selectedLabel?: string;
  /** Callback al hacer clic. Si se provee, la card se renderiza como `<button>`. */
  onClick?: () => void;
  /** Estado de error — añade borde rojo para indicar que este campo es requerido. */
  error?: boolean;
  /**
   * Etiqueta del botón link en la parte inferior de la card.
   * Cuando se provee, muestra el área "Button Link" con ícono "+" y este texto.
   * Mapea a la variante WBadge-ActivedButton del diseño Figma.
   */
  buttonLabel?: string;
  /** Callback al hacer clic en el botón link. */
  onButtonClick?: () => void;
  className?: string;
}

/* ─── Ícono check (Icon/Checking — Figma Zafiro) ────────────────────────── */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 8.5L6.5 12L13.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Ícono plus (Icon/System/Plus — Figma Zafiro) ──────────────────────── */

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 2.5V13.5M2.5 8H13.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Componente ─────────────────────────────────────────────────────────── */

/**
 * CardOption — Tarjeta de selección del sistema de diseño Zafiro (Rex+).
 * Fuente: Figma 83u3jh4oyEwvJ2MtoH7L2o · nodo 1170:18944.
 *
 * Muestra el tipo de evaluación con título, descripción y estado de selección.
 * Cuatro estados: básica, con badge "Recomendada", seleccionada o ambas.
 */
export function CardOption({
  title,
  subtitle,
  description,
  recommended = false,
  recommendedLabel = 'Recomendada',
  selected = false,
  selectedLabel = 'Seleccionada',
  onClick,
  error = false,
  buttonLabel,
  onButtonClick,
  className,
}: CardOptionProps) {
  const rootClass = [
    styles.card,
    selected ? styles.selected : '',
    !selected && error ? styles.error : '',
    onClick ? styles.interactive : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const headerClass = [
    styles.header,
    recommended ? styles.headerWithBadge : '',
  ]
    .filter(Boolean)
    .join(' ');

  const titleClass = [
    styles.title,
    recommended ? styles.titleFixed : styles.titleFlexible,
  ]
    .filter(Boolean)
    .join(' ');

  const Tag = onClick ? 'button' : 'div';
  const tagProps = onClick
    ? ({ type: 'button' as const, onClick, 'aria-pressed': selected || undefined } as React.ButtonHTMLAttributes<HTMLButtonElement>)
    : {};

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag className={rootClass} {...(tagProps as any)}>
      {/* Encabezado: título + badge opcional */}
      <div className={headerClass} data-name="Header">
        <p className={titleClass}>
          <span className={styles.titleBold}>{subtitle ? `${title} —` : title}</span>
          {subtitle && (
            <>
              {' '}
              <span className={styles.titleLight}>{subtitle}</span>
            </>
          )}
        </p>

        {recommended && (
          <div className={styles.badge} data-name="Badge">
            <span className={styles.badgeLabel}>{recommendedLabel}</span>
          </div>
        )}
      </div>

      {/* Descripción */}
      <p className={styles.description} data-name="Description">
        {description}
      </p>

      {/* Indicador de selección */}
      {selected && (
        <div className={styles.category} data-name="Category">
          <CheckIcon className={styles.checkIcon} />
          <span className={styles.categoryLabel}>{selectedLabel}</span>
        </div>
      )}

      {/* Button Link (WBadge-ActivedButton) */}
      {buttonLabel && (
        <button
          type="button"
          className={styles.buttonLink}
          onClick={onButtonClick}
          data-name="Button Link"
        >
          <span className={styles.buttonLinkIconWrapper}>
            <PlusIcon className={styles.buttonLinkIcon} />
          </span>
          <span className={styles.buttonLinkLabel}>{buttonLabel}</span>
        </button>
      )}
    </Tag>
  );
}
