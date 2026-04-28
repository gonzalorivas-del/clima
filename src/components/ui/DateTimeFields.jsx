import { useState, useRef, useEffect } from 'react';
import calendarSvg from '../../assets/Calendar.svg';
import clockSvg from '../../assets/Clock.svg';

/*
 * DateField y TimeField — campos de fecha/hora reutilizables.
 * Misma estructura visual que los Selector de fecha del diseño Zafiro:
 *   label (12px) → [texto + ícono] → separador (1px) → helper text (12px)
 */

function RequiredLabel({ text }) {
  if (!text.endsWith('*')) return text;
  return (
    <>
      {text.slice(0, -1).trimEnd()}{' '}
      <span style={{ color: '#E24C4C' }} aria-hidden="true">*</span>
    </>
  );
}

/* ── DateField ──────────────────────────────────────────────────────────────
 *  Input de texto DD/MM/AAAA + botón ícono calendario que abre el picker nativo.
 */
export function DateField({ label, value, onChange, error, supportingText }) {
  const [text, setText] = useState('');
  const pickerRef = useRef(null);

  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-');
      setText(`${d}/${m}/${y}`);
    } else {
      setText('');
    }
  }, [value]);

  const handleCalendarClick = () => {
    if (pickerRef.current) {
      try { pickerRef.current.showPicker(); }
      catch { pickerRef.current.click(); }
    }
  };

  const handleTextChange = (e) => {
    const newVal = e.target.value;
    if (newVal.length < text.length) {
      let updated = newVal;
      if (updated.endsWith('/')) updated = updated.slice(0, -1);
      setText(updated);
      if (updated === '') onChange('');
      return;
    }
    const digits = newVal.replace(/\D/g, '').slice(0, 8);
    let formatted = '';
    if (digits.length <= 2) {
      formatted = digits;
    } else if (digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    }
    setText(formatted);
    if (formatted.length === 10) {
      const [dd, mm, yyyy] = formatted.split('/');
      const iso = `${yyyy}-${mm}-${dd}`;
      const d = new Date(`${iso}T00:00:00`);
      if (
        !isNaN(d) &&
        d.getFullYear() === parseInt(yyyy, 10) &&
        d.getMonth() + 1 === parseInt(mm, 10) &&
        d.getDate() === parseInt(dd, 10)
      ) {
        onChange(iso);
      }
    } else if (digits.length === 0) {
      onChange('');
    }
  };

  const handlePickerChange = (e) => {
    const iso = e.target.value;
    if (iso) {
      const [y, m, d] = iso.split('-');
      setText(`${d}/${m}/${y}`);
    } else {
      setText('');
    }
    onChange(iso || '');
  };

  const labelColor     = error ? '#E24C4C' : '#666666';
  const separatorColor = error ? '#E24C4C' : '#999999';

  return (
    <div style={{ position: 'relative', flex: '1 1 0', minWidth: 0 }}>
      <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, fontWeight: 400, color: labelColor, margin: '0 0 4px', lineHeight: '16px' }}>
        <RequiredLabel text={label} />
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 24 }}>
        <input
          type="text"
          value={text}
          placeholder="DD/MM/AAAA"
          onChange={handleTextChange}
          maxLength={10}
          aria-label={label.replace(/\s*\*$/, '')}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Roboto, sans-serif', fontSize: 16, fontWeight: 400, color: text ? '#333333' : '#666666', padding: 0, minWidth: 0 }}
        />
        <button
          type="button"
          onClick={handleCalendarClick}
          aria-label={`Abrir calendario para ${label.replace(/\s*\*$/, '')}`}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <img src={calendarSvg} width="24" height="24" alt="" aria-hidden="true" />
        </button>
        <input
          ref={pickerRef}
          type="date"
          value={value || ''}
          onChange={handlePickerChange}
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
        />
      </div>
      <div style={{ height: 1, backgroundColor: separatorColor, borderRadius: 16, marginTop: 2 }} />
      <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: error ? '#E24C4C' : '#999999', margin: '4px 0 0', lineHeight: '16px', minHeight: 16 }}>
        {supportingText || ' '}
      </p>
    </div>
  );
}

/* ── TimeField ──────────────────────────────────────────────────────────────
 *  Input de texto HH:MM + botón ícono reloj que abre el picker nativo.
 */
export function TimeField({ label, value, onChange, error, supportingText }) {
  const [text, setText] = useState('');
  const pickerRef = useRef(null);

  useEffect(() => { setText(value || ''); }, [value]);

  const handleClockClick = () => {
    if (pickerRef.current) {
      try { pickerRef.current.showPicker(); }
      catch { pickerRef.current.click(); }
    }
  };

  const handleTextChange = (e) => {
    const newVal = e.target.value;
    if (newVal.length < text.length) {
      let updated = newVal;
      if (updated.endsWith(':')) updated = updated.slice(0, -1);
      setText(updated);
      if (updated === '') onChange('');
      return;
    }
    const digits = newVal.replace(/\D/g, '').slice(0, 4);
    const formatted = digits.length <= 2 ? digits : `${digits.slice(0, 2)}:${digits.slice(2)}`;
    setText(formatted);
    if (formatted.length === 5) onChange(formatted);
    else if (digits.length === 0) onChange('');
  };

  const handlePickerChange = (e) => {
    setText(e.target.value || '');
    onChange(e.target.value || '');
  };

  const labelColor     = error ? '#E24C4C' : '#666666';
  const separatorColor = error ? '#E24C4C' : '#999999';

  return (
    <div style={{ position: 'relative', flex: '1 1 0', minWidth: 0 }}>
      <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, fontWeight: 400, color: labelColor, margin: '0 0 4px', lineHeight: '16px' }}>
        <RequiredLabel text={label} />
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 24 }}>
        <input
          type="text"
          value={text}
          placeholder="HH:MM"
          onChange={handleTextChange}
          maxLength={5}
          aria-label={label.replace(/\s*\*$/, '')}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Roboto, sans-serif', fontSize: 16, fontWeight: 400, color: text ? '#333333' : '#666666', padding: 0, minWidth: 0 }}
        />
        <button
          type="button"
          onClick={handleClockClick}
          aria-label={`Abrir selector de hora para ${label.replace(/\s*\*$/, '')}`}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <img src={clockSvg} width="24" height="24" alt="" aria-hidden="true" />
        </button>
        <input
          ref={pickerRef}
          type="time"
          value={value || ''}
          onChange={handlePickerChange}
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
        />
      </div>
      <div style={{ height: 1, backgroundColor: separatorColor, borderRadius: 16, marginTop: 2 }} />
      <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 12, color: error ? '#E24C4C' : '#999999', margin: '4px 0 0', lineHeight: '16px', minHeight: 16 }}>
        {supportingText || ' '}
      </p>
    </div>
  );
}
