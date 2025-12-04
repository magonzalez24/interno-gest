import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface InvoicePdfViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceNumber: string;
  pdfUrl?: string | null;
  pdfFile?: File | null;
}

export const InvoicePdfViewerModal = ({
  open,
  onOpenChange,
  invoiceNumber,
  pdfUrl,
  pdfFile,
}: InvoicePdfViewerModalProps) => {
  const { t } = useTranslation();

  // Generar URL del objeto para el archivo local si existe
  const [objectUrl, setObjectUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (pdfFile && open) {
      const url = URL.createObjectURL(pdfFile);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setObjectUrl(null);
    }
  }, [pdfFile, open]);

  const displayUrl = pdfUrl || objectUrl;

  const handleDownload = () => {
    if (displayUrl) {
      const link = document.createElement('a');
      link.href = displayUrl;
      link.download = `${invoiceNumber}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>
              {t('billing.invoices.viewer.title', 'Factura')}: {invoiceNumber}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {displayUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('billing.invoices.viewer.download', 'Descargar')}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {displayUrl ? (
            <iframe
              src={displayUrl}
              className="w-full h-full border-0"
              title={invoiceNumber}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  {t('billing.invoices.viewer.noPdf', 'No hay PDF disponible para esta factura')}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

