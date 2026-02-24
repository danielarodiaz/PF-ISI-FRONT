export const SHIFT_CONFIG = {
  morningStart: Number(import.meta.env.VITE_MORNING_START) || 9,
  morningEnd: Number(import.meta.env.VITE_MORNING_END) || 13,
  afternoonStart: Number(import.meta.env.VITE_AFTERNOON_START) || 15.5,
  afternoonEnd: Number(import.meta.env.VITE_AFTERNOON_END) || 20.5,
  timeZone: import.meta.env.VITE_INSTITUTION_TIMEZONE || "America/Argentina/Buenos_Aires",
};

// Formatea 15.5 a "15:30" visualmente
export const formatDecimalToTime = (decimalTime) => {
  const hours = Math.floor(decimalTime).toString().padStart(2, "0");
  const mins = Math.round((decimalTime % 1) * 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};

// Obtiene la hora decimal forzando la Zona Horaria de la Institución
export const getInstitutionDecimalTime = (dateInput = new Date()) => {
  const options = {
    timeZone: SHIFT_CONFIG.timeZone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false // Forzamos formato 24hs
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const timeString = formatter.format(dateInput);
  
  const [hourStr, minuteStr] = timeString.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (hour === 24) hour = 0; // Corrección de medianoche
  
  return hour + minute / 60;
};