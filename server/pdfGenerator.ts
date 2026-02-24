import PDFDocument from 'pdfkit';
import { Order } from '@shared/schema';

interface InvoiceData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  documentType: string;
  governmentTax: number;
  serviceFee: number;
  expressFee: number;
  total: number;
  createdAt: Date;
}

export function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('AutoDossiers', 50, 50);
      doc.fontSize(10).font('Helvetica').text('Service de carte grise en ligne', 50, 80);
      
      // Invoice title
      doc.fontSize(18).font('Helvetica-Bold').text('FACTURE', 400, 50, { align: 'right' });
      doc.fontSize(10).font('Helvetica').text(`N° ${data.orderNumber}`, 400, 75, { align: 'right' });
      
      // Line separator
      doc.moveTo(50, 110).lineTo(550, 110).stroke();

      // Invoice date
      const formattedDate = data.createdAt.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      doc.fontSize(10).text(`Date: ${formattedDate}`, 50, 130);

      // Customer info
      doc.fontSize(12).font('Helvetica-Bold').text('Client:', 50, 160);
      doc.fontSize(10).font('Helvetica');
      doc.text(data.customerName, 50, 180);
      doc.text(data.customerEmail, 50, 195);
      doc.text(data.customerPhone, 50, 210);

      // Document type
      doc.fontSize(12).font('Helvetica-Bold').text('Prestation:', 300, 160);
      doc.fontSize(10).font('Helvetica').text(data.documentType, 300, 180);

      // Line separator
      doc.moveTo(50, 250).lineTo(550, 250).stroke();

      // Price breakdown table
      const tableTop = 270;
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Description', 50, tableTop);
      doc.text('Montant HT', 400, tableTop, { width: 100, align: 'right' });

      doc.font('Helvetica');
      let y = tableTop + 25;

      if (data.governmentTax > 0) {
        doc.text('Taxes gouvernementales', 50, y);
        doc.text(`${data.governmentTax.toFixed(2)} €`, 400, y, { width: 100, align: 'right' });
        y += 20;
      }

      doc.text('Frais de service', 50, y);
      doc.text(`${data.serviceFee.toFixed(2)} €`, 400, y, { width: 100, align: 'right' });
      y += 20;

      if (data.expressFee > 0) {
        doc.text('Option express (24h)', 50, y);
        doc.text(`${data.expressFee.toFixed(2)} €`, 400, y, { width: 100, align: 'right' });
        y += 20;
      }

      // Separator before total
      doc.moveTo(300, y + 10).lineTo(550, y + 10).stroke();

      // Total
      y += 30;
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('TOTAL TTC', 300, y);
      doc.text(`${data.total.toFixed(2)} €`, 400, y, { width: 100, align: 'right' });

      // Footer
      doc.fontSize(8).font('Helvetica').fillColor('#666666');
      doc.text('AutoDossiers - Service de carte grise en ligne', 50, 700, { align: 'center', width: 500 });
      doc.text('contact@autodossiers.fr | 07 61 87 06 68', 50, 715, { align: 'center', width: 500 });
      doc.text('TVA non applicable - Article 293 B du CGI', 50, 730, { align: 'center', width: 500 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export function orderToInvoiceData(order: Order): InvoiceData {
  return {
    orderNumber: order.orderNumber,
    customerName: `${order.firstName} ${order.lastName}`,
    customerEmail: order.email,
    customerPhone: order.phone,
    documentType: order.documentType,
    governmentTax: parseFloat(order.governmentTax || '0'),
    serviceFee: parseFloat(order.serviceFee || '30'),
    expressFee: parseFloat(order.expressFee || '0'),
    total: parseFloat(order.price),
    createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
  };
}
