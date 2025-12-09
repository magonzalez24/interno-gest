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
import type { Project } from '@/types/database';

export enum DocumentType {
  PLIEGO = 'PLIEGO',
  DOCUMENTACION = 'DOCUMENTACION',
  CONTRATO = 'CONTRATO',
  PROPUESTA = 'PROPUESTA',
  OTRO = 'OTRO',
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  name: string;
  type: DocumentType;
  description?: string;
  pdfUrl?: string | null;
  pdfFile?: File | null;
  uploadDate: Date;
}

interface AddDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  document?: ProjectDocument | null;
  onSuccess: () => void;
}

export const AddDocumentModal = ({ 
  open, 
  onOpenChange, 
  project,
  document,
  onSuccess 
}: AddDocumentModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    type: DocumentType.OTRO as DocumentType,
    description: '',
  });

  useEffect(() => {
    if (open) {
      if (document) {
        // Modo edición
        setFormData({
          name: document.name,
          type: document.type,
          description: document.description || '',
        });
        setPdfFile(document.pdfFile || null);
        setPdfFileName(document.pdfFile?.name || '');
      } else {
        // Modo creación
        setFormData({
          name: '',
          type: DocumentType.OTRO,
          description: '',
        });
        setPdfFile(null);
        setPdfFileName('');
      }
    }
  }, [open, document]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea PDF
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Error',
          description: 'Solo se permiten archivos PDF',
          variant: 'destructive',
        });
        return;
      }
      
      // Validar tamaño (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'El archivo no puede ser mayor a 10MB',
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
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre del documento es requerido',
        variant: 'destructive',
      });
      return;
    }

    if (!document && !pdfFile) {
      toast({
        title: 'Error',
        description: 'Debes subir un archivo PDF',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Aquí iría la lógica para subir el PDF y crear/actualizar el documento
      // Por ahora simulamos con un delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En producción, aquí se haría:
      // 1. Subir el PDF a un servicio de almacenamiento (S3, etc.)
      // 2. Crear/actualizar el documento en la base de datos con la URL del PDF
      // await api.createDocument({ ...formData, pdfUrl: uploadedPdfUrl });
      
      toast({
        title: 'Éxito',
        description: document ? 'Documento actualizado correctamente' : 'Documento creado correctamente',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al guardar el documento',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getDocumentTypeLabel = (type: DocumentType) => {
    switch (type) {
      case DocumentType.PLIEGO:
        return 'Pliego';
      case DocumentType.DOCUMENTACION:
        return 'Documentación';
      case DocumentType.CONTRATO:
        return 'Contrato';
      case DocumentType.PROPUESTA:
        return 'Propuesta';
      case DocumentType.OTRO:
        return 'Otro';
      default:
        return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {document ? 'Editar Documento' : 'Nuevo Documento'}
          </DialogTitle>
          <DialogDescription>
            {document 
              ? 'Edita la información del documento' 
              : 'Añade un nuevo documento al proyecto'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre del Documento *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Pliego de condiciones técnicas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">
                Tipo de Documento *
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as DocumentType })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DocumentType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {getDocumentTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Descripción
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del documento (opcional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdf">
                Archivo PDF {!document && '*'}
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
                          Haz clic para subir
                        </span>{' '}
                        o arrastra y suelta
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Solo archivos PDF (máx. 10MB)
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
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? 'Guardando...' 
                : document ? 'Actualizar' : 'Crear Documento'
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

