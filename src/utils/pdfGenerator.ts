import jsPDF from 'jspdf';
import type { Assessment, Athlete } from '../types';

const PRIMARY = '#0D5C63';
const DANGER = '#DC2626';
const AMBER = '#D97706';

function hex2rgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function setColor(doc: jsPDF, hex: string) {
  const [r, g, b] = hex2rgb(hex);
  doc.setTextColor(r, g, b);
}

function setFill(doc: jsPDF, hex: string) {
  const [r, g, b] = hex2rgb(hex);
  doc.setFillColor(r, g, b);
}

function setDraw(doc: jsPDF, hex: string) {
  const [r, g, b] = hex2rgb(hex);
  doc.setDrawColor(r, g, b);
}

export function generatePDF(assessment: Assessment, athlete: Athlete) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = 0;

  function newPage() {
    doc.addPage();
    y = 15;
    addHeader();
  }

  function checkY(needed = 20) {
    if (y + needed > 270) newPage();
  }

  function addHeader() {
    // Teal header bar
    setFill(doc, PRIMARY);
    doc.rect(0, 0, pageW, 18, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('ClearHead – SCAT 6 Concussion Assessment', margin, 12);
    doc.setFontSize(9);
    doc.text(`${assessment.type === 'baseline' ? 'Baseline' : 'Post-Incident'} · ${new Date(assessment.date).toLocaleDateString()}`, pageW - margin, 12, { align: 'right' });
    y = 24;
  }

  function sectionHeader(title: string) {
    checkY(14);
    setFill(doc, '#F0FDFA');
    doc.rect(margin, y, contentW, 8, 'F');
    setDraw(doc, PRIMARY);
    doc.rect(margin, y, contentW, 8, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    setColor(doc, PRIMARY);
    doc.text(title.toUpperCase(), margin + 4, y + 5.5);
    y += 10;
  }

  function row(label: string, value: string | number | null | undefined, highlight = false) {
    checkY(7);
    const valStr = value !== null && value !== undefined ? String(value) : '—';
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setColor(doc, '#6B7280');
    doc.text(label, margin + 2, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    if (highlight) {
      const numVal = parseFloat(valStr);
      setColor(doc, isNaN(numVal) ? '#111827' : numVal > 0 ? DANGER : PRIMARY);
    } else {
      setColor(doc, '#111827');
    }
    doc.text(valStr, margin + 70, y, { maxWidth: contentW - 72 });
    y += 6;
  }

  function divider() {
    setDraw(doc, '#E5E7EB');
    doc.line(margin, y, margin + contentW, y);
    y += 3;
  }

  function scoreBox(label: string, score: number | null, maxScore: number, higherIsBetter = true) {
    checkY(14);
    const val = score !== null ? score : null;
    let color = PRIMARY;
    if (val !== null) {
      const ratio = val / maxScore;
      if (higherIsBetter) {
        color = ratio >= 0.9 ? '#16A34A' : ratio >= 0.7 ? AMBER : DANGER;
      } else {
        color = ratio <= 0.2 ? '#16A34A' : ratio <= 0.5 ? AMBER : DANGER;
      }
    }
    const [cr, cg, cb] = hex2rgb(color);
    doc.setFillColor(cr, cg, cb);
    doc.rect(margin, y, 35, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(val !== null ? `${val}/${maxScore}` : '–', margin + 17.5, y + 7, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setColor(doc, '#374151');
    doc.text(label, margin + 38, y + 7);
    y += 12;
  }

  // --- Begin document ---
  addHeader();

  // Patient info
  const pi = assessment.sections.patientInfo || {};
  sectionHeader('1. Patient Information');
  row('Name', pi.name || athlete.name);
  row('Date of Birth', pi.dateOfBirth || athlete.dateOfBirth);
  row('Age', pi.age || '');
  row('Sex', pi.sex || '');
  row('Sport', pi.sport || athlete.sport);
  row('Team', pi.team || athlete.team);
  row('Position', pi.position || athlete.position || '');
  row('Dominant Hand', pi.dominantHand || '');
  row('Years of Education', pi.yearsOfEducation || '');
  row('Examiner', pi.examinerName || assessment.completedBy);
  row('Exam Date / Time', `${pi.examDate || ''} ${pi.timeOfExam || ''}`.trim());
  if (pi.incidentDate) row('Date of Incident', `${pi.incidentDate} ${pi.incidentTime || ''}`.trim());
  if (pi.mechanism) {
    checkY(14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setColor(doc, '#6B7280');
    doc.text('Mechanism of Injury', margin + 2, y);
    y += 5;
    setColor(doc, '#111827');
    const lines = doc.splitTextToSize(pi.mechanism, contentW - 4);
    doc.text(lines, margin + 2, y);
    y += lines.length * 5 + 3;
  }

  // Observed signs (post-incident only)
  const obs = assessment.sections.observedSigns;
  if (obs) {
    sectionHeader('2. Observed Signs of Concussion');
    const signsPresent = Object.entries(obs.signs || {}).filter(([, v]) => v).map(([k]) => k);
    if (signsPresent.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      setColor(doc, DANGER);
      signsPresent.forEach(sign => {
        checkY(6);
        doc.text(`• ${sign}`, margin + 2, y);
        y += 5;
      });
    } else {
      row('Result', 'No observable signs noted');
    }
    if (obs.notes) row('Notes', obs.notes);
  }

  // Red flags
  const rf = assessment.sections.redFlags;
  if (rf) {
    sectionHeader('3. Red Flags');
    const flagsPresent = Object.entries(rf.flags || {}).filter(([, v]) => v).map(([k]) => k);
    if (flagsPresent.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      setColor(doc, DANGER);
      doc.text('⚠ RED FLAGS PRESENT:', margin + 2, y);
      y += 6;
      flagsPresent.forEach(flag => {
        checkY(6);
        doc.text(`• ${flag}`, margin + 4, y);
        y += 5;
      });
      row('Emergency contacted', rf.emergencyContacted ? 'Yes' : 'No');
    } else {
      row('Result', 'No red flags identified');
    }
  }

  // Maddocks
  const mad = assessment.sections.maddocks;
  if (mad) {
    sectionHeader('4. Maddocks Questions');
    scoreBox('Maddocks Score', mad.score, 5);
    if (mad.answers) {
      Object.entries(mad.answers).forEach(([, ans]: [string, any]) => {
        if (ans?.answer) {
          checkY(6);
          const correct = ans.correct === true ? '✓' : ans.correct === false ? '✗' : '?';
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          const [r, g, b] = hex2rgb(ans.correct === true ? '#16A34A' : ans.correct === false ? DANGER : '#6B7280');
          doc.setTextColor(r, g, b);
          doc.text(`${correct} ${ans.answer}`, margin + 2, y);
          y += 5;
        }
      });
    }
  }

  // Symptoms
  const sym = assessment.sections.symptoms;
  if (sym) {
    sectionHeader('5. Symptom Evaluation');
    scoreBox('Total Symptom Score', sym.totalScore, 132, false);
    row('Number of Symptoms', `${sym.symptomsPresent}/22`);
    if (sym.scores) {
      divider();
      Object.entries(sym.scores).forEach(([key, val]: [string, any]) => {
        if (Number(val) > 0) {
          row(key, val, true);
        }
      });
    }
  }

  // Cognitive
  const cog = assessment.sections.cognitive;
  if (cog) {
    sectionHeader('6. Cognitive Screening (SAC)');
    scoreBox('Orientation', cog.orientScore, 5);
    scoreBox('Immediate Memory', cog.imTotal, 15);
    if (cog.imScores) {
      row('  Trial 1/2/3', cog.imScores.join(' / '));
    }
    scoreBox('Digit Fwd / Bwd', null, 8);
    row('  Forward score', cog.digitFwdScore);
    row('  Backward score', cog.digitBwdScore);
    if (cog.monthsScore !== null) scoreBox('Months Backward', cog.monthsScore, 12);
    row('Words used', (cog.words || []).join(', '));
  }

  newPage();

  // Neurological
  const neuro = assessment.sections.neurological;
  if (neuro) {
    sectionHeader('7. Neurological Screen');
    row('Normal findings', neuro.normalCount);
    row('Abnormal findings', neuro.abnormalCount, true);
    if (neuro.abnormalCount > 0) {
      const abnormalItems = Object.entries(neuro.checks || {})
        .filter(([, v]) => v === 'abnormal')
        .map(([k]) => k);
      abnormalItems.forEach(item => {
        checkY(6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        setColor(doc, DANGER);
        doc.text(`• ${item}`, margin + 2, y);
        y += 5;
      });
    }
    if (neuro.notes) row('Notes', neuro.notes);
  }

  // Tandem gait
  const tg = assessment.sections.tandemGait;
  if (tg) {
    sectionHeader('8. Tandem Gait');
    row('Best time', tg.bestTime ? `${tg.bestTime.toFixed(1)}s` : '—', tg.bestTime > 14);
    row('Average time', tg.avgTime ? `${tg.avgTime.toFixed(1)}s` : '—');
    (tg.trials || []).forEach((t: number | null, i: number) => {
      row(`  Trial ${i + 1}`, t !== null ? `${t}s` : 'Not completed');
    });
    if (tg.notes) row('Notes', tg.notes);
  }

  // BESS
  const bess = assessment.sections.bess;
  if (bess) {
    sectionHeader('9. BESS (Balance Error Scoring System)');
    scoreBox('BESS Score', bess.bessScore, 60);
    row('Total Errors', bess.totalErrors, true);
    const conditions = ['firm_double', 'firm_single', 'firm_tandem', 'foam_double', 'foam_single', 'foam_tandem'];
    const condLabels = ['Firm Double', 'Firm Single', 'Firm Tandem', 'Foam Double', 'Foam Single', 'Foam Tandem'];
    conditions.forEach((c, i) => {
      row(`  ${condLabels[i]}`, bess.errors?.[c] !== undefined ? `${bess.errors[c]} errors` : '—');
    });
    if (bess.notes) row('Notes', bess.notes);
  }

  // Delayed recall
  const dr = assessment.sections.delayedRecall;
  if (dr) {
    sectionHeader('10. Delayed Recall');
    scoreBox('Delayed Recall', dr.score, 5);
    if (dr.elapsedMinutes !== null && dr.elapsedMinutes !== undefined) {
      row('Time since Step 6', `${dr.elapsedMinutes} minutes`);
    }
    const recalled = Object.entries(dr.recalled || {})
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(', ');
    row('Words recalled', recalled || 'None');
    if (dr.freeRecall) row('Free recall response', dr.freeRecall);
  }

  // Decision
  const dec = assessment.sections.decision;
  if (dec) {
    sectionHeader('11. Clinical Decision');
    if (!assessment.sections.patientInfo?.name.includes('baseline')) {
      row('Return to play', dec.clearForReturn === true ? 'Cleared' : dec.clearForReturn === false ? 'NOT CLEARED – Remove from play' : 'Not determined', dec.clearForReturn === false);
    }
    if (dec.diagnosis) {
      checkY(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      setColor(doc, '#374151');
      doc.text('Clinical Impression:', margin + 2, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(dec.diagnosis, contentW - 4);
      setColor(doc, '#111827');
      doc.text(lines, margin + 2, y);
      y += lines.length * 5 + 3;
    }
    if (dec.recommendations) {
      checkY(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      setColor(doc, '#374151');
      doc.text('Recommendations:', margin + 2, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(dec.recommendations, contentW - 4);
      setColor(doc, '#111827');
      doc.text(lines, margin + 2, y);
      y += lines.length * 5 + 3;
    }
    if (dec.followUp) row('Follow-up Plan', dec.followUp);
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    setColor(doc, '#9CA3AF');
    doc.text(
      `ClearHead SCAT 6 · Confidential Medical Document · Page ${i} of ${pageCount}`,
      pageW / 2,
      290,
      { align: 'center' }
    );
    doc.text(
      'This assessment tool is based on SCAT 6 (Sport Concussion Assessment Tool). Not a substitute for clinical judgment.',
      pageW / 2,
      294,
      { align: 'center', maxWidth: contentW }
    );
  }

  // Save
  const filename = `ClearHead_${athlete.name.replace(/\s+/g, '_')}_${assessment.type}_${new Date(assessment.date).toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
