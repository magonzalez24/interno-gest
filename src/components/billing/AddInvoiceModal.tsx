import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileText, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Project } from '@/types/database';

// Helper para formatear fecha a YYYY-MM-DD
const formatDateForInput = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

interface AddInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onSuccess: () => void;
}

export const AddInvoiceModal = ({ 
  open, 
  onOpenChange, 
  project,
  onSuccess 
}: AddInvoiceModalProps) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    amount: '',
    issueDate: '',
    dueDate: '',
    status: 'DRAFT' as 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE',
    description: '',
  });

  useEffect(() => {
    if (open) {
      // Resetear formulario al abrir
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      setFormData({
        invoiceNumber: '',
        amount: '',
        issueDate: formatDateForInput(today),
        dueDate: formatDateForInput(nextMonth),
        status: 'DRAFT',
        description: '',
      });
      setPdfFile(null);
      setPdfFileName('');
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea PDF
      if (file.type !== 'application/pdf') {
        toast({
          title: t('billing.invoices.modal.error', 'Error'),
          description: t('billing.invoices.modal.invalidFileType', 'Solo se permiten archivos PDF'),
          variant: 'destructive',
        });
        return;
      }
      
      // Validar tamaño (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t('billing.invoices.modal.error', 'Error'),
          description: t('billing.invoices.modal.fileTooLarge', 'El archivo no puede ser mayor a 10MB'),
          variant: 'destructive',
        });
        return;
      }
      
      setPdfFile(file);
      setPdfFileName(file.name);
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    setPdfFileName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.issueDate || !formData.dueDate) {
      toast({
        title: t('billing.invoices.modal.error', 'Error'),
        description: t('billing.invoices.modal.requiredFields', 'Por favor completa todos los campos requeridos'),
        variant: 'destructive',
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: t('billing.invoices.modal.error', 'Error'),
        description: t('billing.invoices.modal.invalidAmount', 'El monto debe ser un número mayor a 0'),
        variant: 'destructive',
      });
      return;
    }

    const issueDate = new Date(formData.issueDate);
    const dueDate = new Date(formData.dueDate);

    if (dueDate < issueDate) {
      toast({
        title: t('billing.invoices.modal.error', 'Error'),
        description: t('billing.invoices.modal.invalidDates', 'La fecha de vencimiento debe ser posterior a la fecha de emisión'),
        variant: 'destructive',
      });
      return;
    }

    if (!pdfFile) {
      toast({
        title: t('billing.invoices.modal.error', 'Error'),
        description: t('billing.invoices.modal.pdfRequired', 'Debes subir un archivo PDF'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Aquí iría la lógica para subir el PDF y crear la factura
      // Por ahora simulamos con un delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En producción, aquí se haría:
      // 1. Subir el PDF a un servicio de almacenamiento (S3, etc.)
      // 2. Crear la factura en la base de datos con la URL del PDF
      // await mockApi.createInvoice({ ...formData, pdfUrl: uploadedPdfUrl });
      
      // Para el mock, guardamos el archivo en localStorage o en el estado
      // En producción, esto se haría en el backend
      
      toast({
        title: t('billing.invoices.modal.success', 'Éxito'),
        description: t('billing.invoices.modal.created', 'Factura creada correctamente'),
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: t('billing.invoices.modal.error', 'Error'),
        description: error instanceof Error ? error.message : t('billing.invoices.modal.createError', 'Error al crear la factura'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('billing.invoices.modal.title', 'Nueva Factura')}</DialogTitle>
          <DialogDescription>
            {t('billing.invoices.modal.description', 'Añade una nueva factura al proyecto')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">
                {t('billing.invoices.modal.invoiceNumber', 'Número de Factura')}
              </Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                placeholder={t('billing.invoices.modal.invoiceNumberPlaceholder', 'Ej: INV-2024-001')}
              />
              <p className="text-xs text-muted-foreground">
                {t('billing.invoices.modal.invoiceNumberHint', 'Deja vacío para generar automáticamente')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  {t('billing.invoices.modal.amount', 'Monto')} *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  {t('billing.invoices.modal.status', 'Estado')} *
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as typeof formData.status })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">
                      {t('billing.invoices.status.draft', 'Borrador')}
                    </SelectItem>
                    <SelectItem value="SENT">
                      {t('billing.invoices.status.sent', 'Enviada')}
                    </SelectItem>
                    <SelectItem value="PAID">
                      {t('billing.invoices.status.paid', 'Pagada')}
                    </SelectItem>
                    <SelectItem value="OVERDUE">
                      {t('billing.invoices.status.overdue', 'Vencida')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">
                  {t('billing.invoices.modal.issueDate', 'Fecha de Emisión')} *
                </Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">
                  {t('billing.invoices.modal.dueDate', 'Fecha de Vencimiento')} *
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                {t('billing.invoices.modal.description', 'Descripción')}
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('billing.invoices.modal.descriptionPlaceholder', 'Descripción de la factura (opcional)')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdf">
                {t('billing.invoices.modal.pdf', 'Archivo PDF')} *
              </Label>
              {!pdfFile ? (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="pdf"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">
                          {t('billing.invoices.modal.clickToUpload', 'Haz clic para subir')}
                        </span>{' '}
                        {t('billing.invoices.modal.orDragDrop', 'o arrastra y suelta')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('billing.invoices.modal.pdfOnly', 'Solo archivos PDF (máx. 10MB)')}
                      </p>
                    </div>
                    <input
                      id="pdf"
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-accent/50">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{pdfFileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {pdfFile ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('common.cancel', 'Cancelar')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? t('billing.invoices.modal.saving', 'Guardando...') 
                : t('billing.invoices.modal.create', 'Crear Factura')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

