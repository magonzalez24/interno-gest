import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import type { Project } from '@/types/database';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ArrowLeft, Plus, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AddInvoiceModal } from '@/components/billing/AddInvoiceModal';
import { InvoicePdfViewerModal } from '@/components/billing/InvoicePdfViewerModal';

// Tipo para facturas
interface Invoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  amount: number;
  issueDate: Date | string;
  dueDate: Date | string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
  description?: string;
  pdfUrl?: string | null;
}

export const ProjectInvoicesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [project, setProject] = useState<Project | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [projectData, invoicesData] = await Promise.all([
          api.getProjectById(id),
          api.getProjectInvoices(id),
        ]);
        setProject(projectData);
        
        // Convertir las facturas del backend al formato esperado
        const formattedInvoices: Invoice[] = invoicesData.map((inv: any) => ({
          id: inv.id,
          invoiceNumber: inv.invoiceNumber,
          projectId: inv.projectId,
          amount: Number(inv.amount),
          issueDate: typeof inv.issueDate === 'string' ? new Date(inv.issueDate) : inv.issueDate,
          dueDate: typeof inv.dueDate === 'string' ? new Date(inv.dueDate) : inv.dueDate,
          status: inv.status,
          description: inv.description,
          pdfUrl: inv.pdfUrl,
        }));
        setInvoices(formattedInvoices);
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Invoice['status']) => {
    switch (status) {
      case 'PAID':
        return t('billing.invoices.status.paid', 'Pagada');
      case 'SENT':
        return t('billing.invoices.status.sent', 'Enviada');
      case 'DRAFT':
        return t('billing.invoices.status.draft', 'Borrador');
      case 'OVERDUE':
        return t('billing.invoices.status.overdue', 'Vencida');
      default:
        return status;
    }
  };

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (!project) {
    return <div>{t('billing.invoices.projectNotFound', 'Proyecto no encontrado')}</div>;
  }

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices
    .filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/billing')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground mt-1">
            {t('billing.invoices.title', 'Facturas del Proyecto')}
          </p>
        </div>
        <Button onClick={() => setIsAddInvoiceModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('billing.invoices.new', 'Nueva Factura')}
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('billing.invoices.summary.total', 'Total Facturado')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('billing.invoices.summary.paid', 'Pagado')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('billing.invoices.summary.pending', 'Pendiente')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(pendingAmount)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de facturas */}
      <Card>
        <CardHeader>
          <CardTitle>{t('billing.invoices.list', 'Facturas')}</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="py-10 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {t('billing.invoices.empty', 'No hay facturas registradas para este proyecto')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setIsPdfViewerOpen(true);
                  }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{invoice.invoiceNumber}</p>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusLabel(invoice.status)}
                        </Badge>
                      </div>
                      {invoice.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {invoice.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>
                          {t('billing.invoices.issueDate', 'Emisión')}: {formatDate(typeof invoice.issueDate === 'string' ? new Date(invoice.issueDate) : invoice.issueDate)}
                        </span>
                        <span>
                          {t('billing.invoices.dueDate', 'Vencimiento')}: {formatDate(typeof invoice.dueDate === 'string' ? new Date(invoice.dueDate) : invoice.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{formatCurrency(invoice.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {project && (
        <AddInvoiceModal
          open={isAddInvoiceModalOpen}
          onOpenChange={setIsAddInvoiceModalOpen}
          project={project}
          onSuccess={async () => {
            // Recargar facturas después de crear una nueva
            if (!id) return;
            try {
              const invoicesData = await api.getProjectInvoices(id);
              const formattedInvoices: Invoice[] = invoicesData.map((inv: any) => ({
                id: inv.id,
                invoiceNumber: inv.invoiceNumber,
                projectId: inv.projectId,
                amount: Number(inv.amount),
                issueDate: typeof inv.issueDate === 'string' ? new Date(inv.issueDate) : inv.issueDate,
                dueDate: typeof inv.dueDate === 'string' ? new Date(inv.dueDate) : inv.dueDate,
                status: inv.status,
                description: inv.description,
                pdfUrl: inv.pdfUrl,
              }));
              setInvoices(formattedInvoices);
            } catch (error) {
              console.error('Error reloading invoices:', error);
            }
          }}
        />
      )}

      {selectedInvoice && (
        <InvoicePdfViewerModal
          open={isPdfViewerOpen}
          onOpenChange={setIsPdfViewerOpen}
          invoiceNumber={selectedInvoice.invoiceNumber}
          pdfUrl={selectedInvoice.pdfUrl}
          pdfFile={selectedInvoice.pdfFile}
        />
      )}
    </div>
  );
};

