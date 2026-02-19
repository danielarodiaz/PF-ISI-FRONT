const SESSION_KEY = "turnoActivo";
const LOCAL_REF_KEY = "turnoActivoRef";

export const saveTurnoActivo = (turno) => {
  if (!turno) return;

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(turno));

  if (turno.publicToken) {
    const existingRef = getTurnoActivoRef();
    const ref = {
      publicToken: turno.publicToken,
      idTurno: turno.idTurno,
      legajo: turno.legajo ?? null,
      nombreTurno: turno.nombreTurno ?? null,
      initialPersonasAdelante: existingRef?.initialPersonasAdelante ?? null,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_REF_KEY, JSON.stringify(ref));
  }
};

export const getTurnoActivo = () => {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getTurnoActivoRef = () => {
  const raw = localStorage.getItem(LOCAL_REF_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const updateTurnoActivoRef = (patch) => {
  const current = getTurnoActivoRef();
  if (!current) return;
  const updated = { ...current, ...patch };
  localStorage.setItem(LOCAL_REF_KEY, JSON.stringify(updated));
};

export const clearTurnoActivo = () => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LOCAL_REF_KEY);
};
