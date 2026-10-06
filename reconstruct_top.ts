import { jsPDF } from 'jspdf';
import { InternalFormData } from '../types';
import { wisLogoBase64 } from './wisLogoBase64';

export const generatePDF = (form: InternalFormData) => {
  const docPDF = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const HALF_PT = 0.5 / 2.83465;

  const drawCheck = (label: string, checked: boolean, xOffset: number, yOffset: number, boxSize = 4) => {
    docPDF.setLineWidth(HALF_PT);
    docPDF.setLineDashPattern([], 0);
    const boxTop = yOffset - boxSize + 1;
    docPDF.rect(xOffset, boxTop, boxSize, boxSize);
    if (checked) {
      // Draw checkmark
      docPDF.line(xOffset + boxSize * 0.2, boxTop + boxSize * 0.5, xOffset + boxSize * 0.4, boxTop + boxSize * 0.8);
      docPDF.line(xOffset + boxSize * 0.4, boxTop + boxSize * 0.8, xOffset + boxSize * 0.9, boxTop + boxSize * 0.2);
    }
    docPDF.setFontSize(11);
    docPDF.text(label, xOffset + boxSize + 2, yOffset);
  };

  try {
    if (form.type === 'interviewRating') {
      docPDF.addImage(wisLogoBase64, 'PNG', 10, 5, 80, 21);
    } else if (form.type === 'clearance') {
      // Skip global logo
    } else {
      docPDF.addImage(wisLogoBase64, 'PNG', 12, 8, 45, 14);
    }
  } catch (e) {
    console.warn("Failed to add logo to PDF:", e);
  }

  // The rest of the file...
