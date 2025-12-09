import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getProjectInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    const invoices = await prisma.invoice.findMany({
      where: { projectId },
      include: {
        project: {
          include: {
            office: true,
          },
        },
      },
      orderBy: { issueDate: 'desc' },
    });

    res.json(invoices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getInvoiceById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            office: true,
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    res.json(invoice);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { invoiceNumber, amount, issueDate, dueDate, status, description, pdfUrl } = req.body;

    // Generar número de factura si no se proporciona
    let finalInvoiceNumber = invoiceNumber;
    if (!finalInvoiceNumber) {
      const year = new Date().getFullYear();
      const count = await prisma.invoice.count({
        where: {
          invoiceNumber: {
            startsWith: `INV-${year}`,
          },
        },
      });
      finalInvoiceNumber = `INV-${year}-${String(count + 1).padStart(3, '0')}`;
    }

    const invoice = await prisma.invoice.create({
      data: {
        projectId,
        invoiceNumber: finalInvoiceNumber,
        amount: parseFloat(amount),
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        status: status || 'DRAFT',
        description,
        pdfUrl,
      },
      include: {
        project: {
          include: {
            office: true,
          },
        },
      },
    });

    res.status(201).json(invoice);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: any = { ...req.body };
    
    if (updateData.issueDate) {
      updateData.issueDate = new Date(updateData.issueDate);
    }
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }
    if (updateData.amount) {
      updateData.amount = parseFloat(updateData.amount);
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          include: {
            office: true,
          },
        },
      },
    });

    res.json(invoice);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.invoice.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    res.status(500).json({ error: error.message });
  }
};

