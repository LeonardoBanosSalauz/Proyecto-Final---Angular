import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core'; // utiliza las funciones nativas de js de fecha

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  // sobreescribes el método parse
  override parse(value: any): Date | null {
    // Primero, verifica si el value es un string que contiene una barra (/)
    // tiene que ser mayor a -1 ya que si devuelve -1 es porque no encuentra ese valor en la cadena
    if (typeof value === 'string' && value.indexOf('/') > -1) {
      // Luego convierte cada parte en un número: día (date), mes (month), y año (year).
      const str = value.split('/');

      const year = Number(str[2]); // último elemento de la cadena
      // Sin este ajuste (-1), por ej: al pasar 12 como el mes, JavaScript interpretaría esto como enero del año siguiente (2024), ya que la indexación empezaría desde 0.
      const month = Number(str[1]) - 1; // segundo de la cadena
      const date = Number(str[0]); // primero

      return new Date(year, month, date);
    }
    // Si el value no es un string con /, intenta convertirlo en un timestamp (marca de tiempo):
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    // Si el resultado es un número válido, crea y retorna una nueva Date. Si no, retorna null.
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  // Convierte la fecha a UTC: Usa Date.UTC para crear una nueva instancia de Date en UTC, asegurándose de que la fecha y hora se mantengan consistentes independientemente de la zona horaria del sistema.
  override format(date: Date, displayFormat: Object): string {
    // Al usar UTC, se asegura que las fechas y horas sean coherentes y no se vean afectadas por las diferencias en las zonas horarias locales.
    date = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      )
    );
    // Combina el displayFormat con una configuración de zona horaria UTC usando Object.assign.
    displayFormat = Object.assign({}, displayFormat, { timeZone: 'utc' });

    // Usa Intl.DateTimeFormat para formatear la fecha de acuerdo con el locale (localización) y displayFormat proporcionados.
    const dtf = new Intl.DateTimeFormat(this.locale, displayFormat);
    // replace(/[\u200e\u200f]/g, '') elimina caracteres de control de texto bidireccional que pueden ser añadidos durante el formateo.
    return dtf.format(date).replace(/[\u200e\u200f]/g, '');
  }
}
