"use client";

import { useEffect, useState } from "react";

type ExpandableTextModalProps = {
  value: string;
  label: string;
  previewLength?: number;
};

function getPreviewText(value: string, previewLength: number) {
  if (value.length <= previewLength) {
    return value;
  }

  return `${value.slice(0, previewLength).trimEnd()}...`;
}

export function ExpandableTextModal({
  value,
  label,
  previewLength = 80,
}: ExpandableTextModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button className="cell-modal-trigger" type="button" onClick={() => setIsOpen(true)}>
        <span className="cell-modal-preview">{getPreviewText(value, previewLength)}</span>
        <span className="cell-modal-action">Ver detalle</span>
      </button>

      {isOpen ? (
        <div
          aria-modal="true"
          className="text-modal-overlay"
          role="dialog"
          onClick={() => setIsOpen(false)}
        >
          <div className="text-modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="text-modal-header">
              <div className="text-modal-copy">
                <span className="section-kicker">Lectura completa</span>
                <h2 className="text-modal-title">{label}</h2>
              </div>
              <button className="secondary-button text-modal-close" type="button" onClick={() => setIsOpen(false)}>
                Cerrar
              </button>
            </div>

            <div className="text-modal-body">{value}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}
