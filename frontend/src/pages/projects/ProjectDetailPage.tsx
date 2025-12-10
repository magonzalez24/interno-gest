import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { api } from '@/lib/api';
import type { Project, ProjectTechnology } from '@/types/database';
import { TechCategory, ExpenseCategory } from '@/types/database';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ArrowLeft, Edit, Plus, FileText } from 'lucide-react';
import { AddTeamMemberModal } from '@/components/projects/AddTeamMemberModal';
import { AddExpenseModal } from '@/components/projects/AddExpenseModal';
import { AddDocumentModal, DocumentType, type ProjectDocument } from '@/components/projects/AddDocumentModal';
import { DocumentPdfViewerModal } from '@/components/projects/DocumentPdfViewerModal';
import type { ProjectExpense } from '@/types/database';

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ProjectExpense | null>(null);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<ProjectDocument | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<ProjectDocument | null>(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);

  const loadProject = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getProjectById(id) as any;
      // Transformar los datos del backend para que coincidan con lo que espera el frontend
      const transformedProject = {
        ...data,
        employees: data.projectEmployees || [],
        technologies: data.projectTechnologies || [],
        departments: data.projectDepartments || [],
        additionalOffices: data.projectOffices || [],
      };
      setProject(transformedProject as Project);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
    loadDocuments();
  }, [id]);

  const loadDocuments = async () => {
    if (!id) return;
    try {
      // TODO: Implementar cuando esté disponible el endpoint de documentos
      // Por ahora, dejamos vacío ya que no está implementado en el backend
      // const documentsData = await api.getProjectDocuments(id);
      // setDocuments(documentsData);
      setDocuments([]);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  // Calcular el gasto total de trabajadores
  const employeeExpenseTotal = useMemo(() => {
    if (!project?.employees) return 0;
    
    const HOURS_PER_YEAR = 2000; // 40 horas/semana * 50 semanas
    
    return project.employees.reduce((total, pe) => {
      const hours = pe.hours || 0;
      const salary = pe.employee?.salary || 0;
      const hourlyRate = salary / HOURS_PER_YEAR;
      return total + (hours * hourlyRate);
    }, 0);
  }, [project]);

  // Calcular el gasto total de otros gastos (servidores, etc.)
  const otherExpensesTotal = useMemo(() => {
    if (!project?.expenses) return 0;
    
    const now = new Date();
    const projectStartDate = project.startDate instanceof Date ? project.startDate : new Date(project.startDate);
    
    return project.expenses.reduce((total, exp) => {
      // Calcular meses desde el inicio hasta ahora (o hasta endDate si existe)
      const endDate = exp.endDate ? (exp.endDate instanceof Date ? exp.endDate : new Date(exp.endDate)) : now;
      const expStartDate = exp.startDate instanceof Date ? exp.startDate : new Date(exp.startDate);
      const startDate = expStartDate > projectStartDate ? expStartDate : projectStartDate;
      const months = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
      return total + (exp.cost * months);
    }, 0);
  }, [project]);

  // Gasto total (trabajadores + otros gastos)
  const totalExpense = useMemo(() => {
    return employeeExpenseTotal + otherExpensesTotal;
  }, [employeeExpenseTotal, otherExpensesTotal]);

  // Calcular el costo por empleado
  const employeeExpenses = useMemo(() => {
    if (!project?.employees) return [];
    
    const HOURS_PER_YEAR = 2000; // 40 horas/semana * 50 semanas
    
    return project.employees.map((pe) => {
      const hours = pe.hours || 0;
      const salary = pe.employee?.salary || 0;
      const hourlyRate = salary / HOURS_PER_YEAR;
      const cost = hours * hourlyRate;
      
      return {
        id: pe.id,
        employee: pe.employee,
        role: pe.role,
        hours,
        allocation: pe.allocation,
        cost,
      };
    }).filter(exp => exp.cost > 0);
  }, [project]);

  // Agrupar tecnologías por categoría
  const techsByCategory = useMemo(() => {
    if (!project?.technologies) return {} as Record<TechCategory, ProjectTechnology[]>;
    
    return project.technologies.reduce((acc, pt) => {
      const category = pt.technology?.category || TechCategory.OTHER;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(pt);
      return acc;
    }, {} as Record<TechCategory, ProjectTechnology[]>);
  }, [project]);

  if (loading) {
    return <div>Cargando proyecto...</div>;
  }

  if (!project) {
    return <div>Proyecto no encontrado</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PLANNING': return 'bg-blue-100 text-blue-800';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{project.clientName}</p>
        </div>
        <Link to={`/projects/${id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="team">Equipo</TabsTrigger>
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
          <TabsTrigger value="technologies">Tecnologías</TabsTrigger>
          <TabsTrigger value="expenses">Gastos</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Descripción</p>
                <p className="mt-1">{project.description || 'Sin descripción'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prioridad</p>
                  <p className="mt-1">{project.priority}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Inicio</p>
                  <p className="mt-1">{formatDate(project.startDate)}</p>
                </div>
                {project.endDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de Fin</p>
                    <p className="mt-1">{formatDate(project.endDate)}</p>
                  </div>
                )}
                {project.budget && (
                  <div>
                    <p className="text-sm text-muted-foreground">Presupuesto</p>
                    <p className="mt-1">{formatCurrency(project.budget)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Gasto</p>
                  <p className="mt-1">{formatCurrency(totalExpense)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sede Principal</p>
                  <p className="mt-1">{project.office?.name}</p>
                </div>
                {project.additionalOffices && project.additionalOffices.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Sedes Adicionales</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {project.additionalOffices.map((po) => (
                        <Badge key={po.id} variant="outline">
                          {po.office?.name || po.officeId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Equipo del Proyecto</CardTitle>
                <Button onClick={() => setIsAddMemberModalOpen(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Compañero
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {project.employees && project.employees.length > 0 ? (
                <div className="space-y-4">
                  {project.employees.map((pe) => (
                    <div key={pe.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {pe.employee?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{pe.employee?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {pe.role}
                            {pe.employee?.office && (
                              <span className="ml-2 text-xs">• {pe.employee.office.name}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{pe.allocation}%</Badge>
                        <Badge variant="secondary">
                          {pe.hours || 0} horas
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay empleados asignados</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Departamentos</CardTitle>
            </CardHeader>
            <CardContent>
              {project.departments && project.departments.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.departments.map((pd) => (
                    <Badge key={pd.id} variant="outline">
                      {pd.department?.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay departamentos asignados</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technologies" className="space-y-4">
          {project.technologies && project.technologies.length > 0 ? (
            Object.entries(techsByCategory)
              .filter(([_, techs]) => techs && techs.length > 0)
              .map(([category, techs]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle>{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {techs?.map((pt) => (
                        <Badge 
                          key={pt.id} 
                          variant="outline"
                          style={{ 
                            borderColor: pt.technology?.color,
                            color: pt.technology?.color 
                          }}
                        >
                          {pt.technology?.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Tecnologías</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No hay tecnologías asignadas</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Gasto Total</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
                  </div>
                  {project.budget && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Presupuesto</p>
                      <p className="text-2xl font-bold">{formatCurrency(project.budget)}</p>
                      <p className={`text-sm mt-1 ${totalExpense > project.budget ? 'text-red-600' : 'text-green-600'}`}>
                        {totalExpense > project.budget ? 'Excede presupuesto' : 'Dentro del presupuesto'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Gastos de Trabajadores</CardTitle>
              </CardHeader>
              <CardContent>
                {employeeExpenses.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {employeeExpenses.map((exp) => (
                        <div key={exp.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {exp.employee?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{exp.employee?.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {exp.role} • {exp.allocation}% dedicación • {exp.hours} horas
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(exp.cost)}</p>
                            {exp.employee?.salary && (
                              <p className="text-xs text-muted-foreground">
                                {formatCurrency(exp.employee.salary)}/año
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Subtotal Trabajadores</p>
                        <p className="font-semibold text-lg">
                          {formatCurrency(employeeExpenses.reduce((sum, exp) => sum + exp.cost, 0))}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No hay gastos de trabajadores registrados</p>
                )}
              </CardContent>
            </Card>

            <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Otros Gastos</CardTitle>
                <Button onClick={() => {
                  setEditingExpense(null);
                  setIsAddExpenseModalOpen(true);
                }} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Gasto
                </Button>
              </div>
            </CardHeader>
            <CardContent >
              {project.expenses && project.expenses.length > 0 ? (
                <>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {Object.values(ExpenseCategory).map((category) => {
                      const categoryExpenses = project.expenses?.filter(exp => exp.category === category) || [];
                      if (categoryExpenses.length === 0) return null;
                      
                      const projectStartDate = project.startDate instanceof Date ? project.startDate : new Date(project.startDate);
                      
                      const categoryTotal = categoryExpenses.reduce((sum, exp) => {
                        const now = new Date();
                        const endDate = exp.endDate ? (exp.endDate instanceof Date ? exp.endDate : new Date(exp.endDate)) : now;
                        const expStartDate = exp.startDate instanceof Date ? exp.startDate : new Date(exp.startDate);
                        const startDate = expStartDate > projectStartDate ? expStartDate : projectStartDate;
                        const months = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
                        return sum + (exp.cost * months);
                      }, 0);
                      
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm uppercase text-muted-foreground">
                              {category.replace('_', ' ')}
                            </h4>
                            <p className="font-semibold">{formatCurrency(categoryTotal)}</p>
                          </div>
                          <div className="space-y-2">
                            {categoryExpenses.map((exp) => {
                              const now = new Date();
                              const projectStartDate = project.startDate instanceof Date ? project.startDate : new Date(project.startDate);
                              const endDate = exp.endDate ? (exp.endDate instanceof Date ? exp.endDate : new Date(exp.endDate)) : now;
                              const expStartDate = exp.startDate instanceof Date ? exp.startDate : new Date(exp.startDate);
                              const startDate = expStartDate > projectStartDate ? expStartDate : projectStartDate;
                              const months = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
                              const totalCost = exp.cost * months;
                              
                              return (
                                <div 
                                  key={exp.id} 
                                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                  onClick={() => {
                                    setEditingExpense(exp);
                                    setIsAddExpenseModalOpen(true);
                                  }}
                                >
                                  <div>
                                    <p className="font-medium">{exp.description}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {formatCurrency(exp.cost)}/mes • {months} meses
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">{formatCurrency(totalCost)}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-2 border-t mt-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Subtotal Otros Gastos</p>
                      <p className="font-semibold text-lg">
                        {formatCurrency(otherExpensesTotal)}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 border border-dashed rounded-lg text-center">
                  <p className="text-muted-foreground">
                    No hay otros gastos registrados
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Documentos del Proyecto</CardTitle>
                <Button onClick={() => {
                  setEditingDocument(null);
                  setIsAddDocumentModalOpen(true);
                }} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Documento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="py-10 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No hay documentos registrados para este proyecto
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.values(DocumentType).map((type) => {
                    const typeDocuments = documents.filter(doc => doc.type === type);
                    if (typeDocuments.length === 0) return null;
                    
                    const getDocumentTypeLabel = (docType: DocumentType) => {
                      switch (docType) {
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
                          return docType;
                      }
                    };
                    
                    return (
                      <div key={type} className="space-y-2">
                        <h4 className="font-semibold text-sm uppercase text-muted-foreground mb-2">
                          {getDocumentTypeLabel(type)}
                        </h4>
                        <div className="space-y-2">
                          {typeDocuments.map((doc) => (
                            <div
                              key={doc.id}
                              onClick={() => {
                                setSelectedDocument(doc);
                                setIsPdfViewerOpen(true);
                              }}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-semibold">{doc.name}</p>
                                  {doc.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {doc.description}
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Subido: {formatDate(doc.uploadDate)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingDocument(doc);
                                    setIsAddDocumentModalOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {project && (
        <>
          <AddTeamMemberModal
            open={isAddMemberModalOpen}
            onOpenChange={setIsAddMemberModalOpen}
            project={project}
            onSuccess={loadProject}
          />
          <AddExpenseModal
            open={isAddExpenseModalOpen}
            onOpenChange={(open) => {
              setIsAddExpenseModalOpen(open);
              if (!open) setEditingExpense(null);
            }}
            project={project}
            expense={editingExpense}
            onSuccess={loadProject}
          />
          <AddDocumentModal
            open={isAddDocumentModalOpen}
            onOpenChange={(open) => {
              setIsAddDocumentModalOpen(open);
              if (!open) setEditingDocument(null);
            }}
            project={project}
            document={editingDocument}
            onSuccess={() => {
              loadDocuments();
            }}
          />
        </>
      )}

      {selectedDocument && (
        <DocumentPdfViewerModal
          open={isPdfViewerOpen}
          onOpenChange={setIsPdfViewerOpen}
          documentName={selectedDocument.name}
          pdfUrl={selectedDocument.pdfUrl}
          pdfFile={selectedDocument.pdfFile}
        />
      )}
    </div>
  );
};

