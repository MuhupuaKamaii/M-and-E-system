import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Utility function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NA', {
    style: 'currency',
    currency: 'NAD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Calculate achievement percentage
const calculateAchievement = (actual, target, direction) => {
  if (!actual || !target) return 0;
  if (direction === 'decrease') {
    return target > actual ? ((target - actual) / target) * 100 : 100;
  } else {
    return (actual / target) * 100;
  }
};

// Get status based on achievement
const getStatus = (achievement) => {
  if (achievement >= 90) return { label: 'On Track', color: '#10b981' };
  if (achievement >= 70) return { label: 'At Risk', color: '#f59e0b' };
  return { label: 'Off Track', color: '#ef4444' };
};

export const generateReportPDF = (reportData) => {
  try {
    console.log('Starting PDF generation with data:', reportData);
    
    const doc = new jsPDF();
    console.log('jsPDF instance created successfully');
    
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = margin;

    // Add NPC Logo and Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('NATIONAL PLANNING COMMISSION', margin, yPosition);
    yPosition += 10;
  
  doc.setFontSize(16);
  doc.text('Quarterly Performance Report', margin, yPosition);
  yPosition += 15;

  // Report Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Programme: ${reportData.programme}`, margin, yPosition);
  yPosition += 8;
  doc.text(`Reporting Period: ${reportData.year} - ${reportData.quarter}`, margin, yPosition);
  yPosition += 8;
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 15;

  // Section 1: Action Steps
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Action Steps (Project Performance)', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Planned Steps
  doc.setFont('helvetica', 'bold');
  doc.text('Action Steps Planned (Reference):', margin, yPosition);
  yPosition += 8;
  doc.setFont('helvetica', 'normal');
  const plannedLines = doc.splitTextToSize(reportData.actionSteps?.planned || 'No planned steps provided', pageWidth - 2 * margin);
  doc.text(plannedLines, margin, yPosition);
  yPosition += plannedLines.length * 5 + 10;

  // Undertaken Steps
  doc.setFont('helvetica', 'bold');
  doc.text('Action Steps Undertaken (Actual):', margin, yPosition);
  yPosition += 8;
  doc.setFont('helvetica', 'normal');
  const undertakenLines = doc.splitTextToSize(reportData.actionSteps?.undertaken || 'No undertaken steps provided', pageWidth - 2 * margin);
  doc.text(undertakenLines, margin, yPosition);
  yPosition += undertakenLines.length * 5 + 15;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = margin;
  }

  // Section 2: Budget Execution
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Budget Execution (Financial Performance)', margin, yPosition);
  yPosition += 10;

  const budgetData = [
    ['Budget Category', 'Allocated Amount (N$)', 'Actual Expenditure (N$)', '% Execution'],
    [
      'Operational Budget',
      formatCurrency(reportData.budget?.opAllocated || 0),
      formatCurrency(reportData.budget?.opSpent || 0),
      `${((reportData.budget?.opSpent || 0) / (reportData.budget?.opAllocated || 1) * 100).toFixed(1)}%`
    ],
    [
      'Development (Capital) Budget',
      formatCurrency(reportData.budget?.devAllocated || 0),
      formatCurrency(reportData.budget?.devSpent || 0),
      `${((reportData.budget?.devSpent || 0) / (reportData.budget?.devAllocated || 1) * 100).toFixed(1)}%`
    ],
    [
      'TOTAL',
      formatCurrency((reportData.budget?.opAllocated || 0) + (reportData.budget?.devAllocated || 0)),
      formatCurrency((reportData.budget?.opSpent || 0) + (reportData.budget?.devSpent || 0)),
      `${(((reportData.budget?.opSpent || 0) + (reportData.budget?.devSpent || 0)) / ((reportData.budget?.opAllocated || 1) + (reportData.budget?.devAllocated || 1)) * 100).toFixed(1)}%`
    ]
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [budgetData[0]],
    body: budgetData.slice(1),
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { left: margin, right: margin }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = margin;
  }

  // Section 3: Indicator Performance
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Indicator Performance (Quarterly Actuals)', margin, yPosition);
  yPosition += 10;

  if (reportData.indicators && reportData.indicators.length > 0) {
    const indicatorTableData = [
      ['Indicator Name', 'Baseline', 'Target', 'Actual', 'Achievement', 'Variance', 'Status']
    ];

    reportData.indicators.forEach(indicator => {
      const achievement = calculateAchievement(indicator.actual, indicator.target, indicator.direction);
      const variance = indicator.actual - indicator.target;
      const status = getStatus(achievement);
      
      indicatorTableData.push([
        indicator.name,
        indicator.baseline?.toString() || '0',
        indicator.target?.toString() || '0',
        indicator.actual?.toString() || '0',
        `${achievement.toFixed(1)}%`,
        `${variance >= 0 ? '+' : ''}${variance.toFixed(1)}`,
        status.label
      ]);
    });

    autoTable(doc, {
      startY: yPosition,
      head: [indicatorTableData[0]],
      body: indicatorTableData.slice(1),
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 25, halign: 'center' },
        5: { cellWidth: 20, halign: 'center' },
        6: { cellWidth: 25, halign: 'center' }
      },
      didParseCell: function (data) {
        if (data.column.index === 6 && data.section === 'body') {
          const status = data.cell.text[0];
          if (status === 'On Track') {
            data.cell.styles.textColor = [16, 185, 129];
          } else if (status === 'At Risk') {
            data.cell.styles.textColor = [245, 158, 11];
          } else if (status === 'Off Track') {
            data.cell.styles.textColor = [239, 68, 68];
          }
        }
      }
    });

    yPosition = doc.lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('No indicator data available.', margin, yPosition);
    yPosition += 15;
  }

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = margin;
  }

  // Section 4: Narrative
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('4. Narrative / Comments', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const narrativeText = reportData.narrative || 'No narrative provided.';
  const narrativeLines = doc.splitTextToSize(narrativeText, pageWidth - 2 * margin);
  doc.text(narrativeLines, margin, yPosition);

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.height - 10);
    doc.text('National Planning Commission - Quarterly Report', margin, doc.internal.pageSize.height - 10);
  }

  // Generate filename
  const quarterNum = reportData.quarter?.replace('Quarter ', '') || '1';
  const yearShort = reportData.year?.replace('/', '-') || '2024-25';
  const fileName = `${reportData.programme?.replace(/\s+/g, '_') || 'Report'}_Q${quarterNum}_${yearShort}.pdf`;

  // Save the PDF
  console.log('Saving PDF with filename:', fileName);
  doc.save(fileName);
  console.log('PDF saved successfully!');
  
  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw error;
  }
};