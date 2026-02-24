import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Plus, Calendar as CalendarIcon, Clock, MapPin, User, CheckCircle, AlertCircle, ChevronDown, FileText } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Job, JobStatus, JobType, PaymentStatus } from '../types';
import { format, parseISO, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../utils/cn';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function Schedule() {
  const { jobs, clients, addJob, updateJob, settings } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('all');

  const [newJob, setNewJob] = useState({
    clientId: '',
    type: 'installation' as JobType,
    description: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    price: 0,
  });

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.clientId || !newJob.description || !newJob.date) return;

    addJob({
      id: uuidv4(),
      clientId: newJob.clientId,
      type: newJob.type,
      description: newJob.description,
      date: new Date(newJob.date).toISOString(),
      price: Number(newJob.price),
      jobStatus: 'scheduled',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    });

    setNewJob({
      clientId: '',
      type: 'installation',
      description: '',
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      price: 0,
    });
    setIsModalOpen(false);
  };

  const toggleJobStatus = (job: Job) => {
    const nextStatus: Record<JobStatus, JobStatus> = {
      'scheduled': 'in_progress',
      'in_progress': 'completed',
      'completed': 'scheduled',
      'canceled': 'scheduled'
    };
    updateJob({ ...job, jobStatus: nextStatus[job.jobStatus] });
  };

  const togglePaymentStatus = (job: Job) => {
    updateJob({ ...job, paymentStatus: job.paymentStatus === 'paid' ? 'pending' : 'paid' });
  };

  const generateReceiptPDF = (job: Job) => {
    try {
      const client = clients.find(c => c.id === job.clientId);
      if (!client) {
        console.error('Client not found for job:', job.clientId);
        return;
      }

      console.log('Generating Receipt PDF for job:', job.id);
      const doc = new jsPDF();

      // Logo and Header
      if (settings.logo) {
        try {
          doc.addImage(settings.logo, 'PNG', 14, 12, 12, 12);
          doc.setFontSize(20);
          doc.setTextColor(37, 99, 235);
          doc.text(settings.companyName, 30, 22);
        } catch (e) {
          console.error('Error adding logo to PDF', e);
          doc.setFontSize(20);
          doc.setTextColor(37, 99, 235);
          doc.text(settings.companyName, 14, 22);
        }
      } else {
        doc.setFontSize(20);
        doc.setTextColor(37, 99, 235); // blue-600
        doc.text(settings.companyName, 14, 22);
      }

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Serviços de Ar-Condicionado', 14, 28);

      // Title
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text('RECIBO DE PRESTAÇÃO DE SERVIÇO', 14, 45);

      // Receipt Info
      doc.setFontSize(10);
      doc.text(`Nº do Recibo: ${job.id.substring(0, 8).toUpperCase()}`, 14, 55);
      doc.text(`Data de Emissão: ${format(new Date(), 'dd/MM/yyyy')}`, 14, 60);
      doc.text(`Data do Serviço: ${format(parseISO(job.date), 'dd/MM/yyyy')}`, 14, 65);

      // Client Info
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Cliente:', 120, 45);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(client.name, 120, 52);
      doc.text(client.phone, 120, 57);

      const fullAddress = [
        `${client.street}, ${client.number}`,
        client.complement,
        `${client.neighborhood}, ${client.city} - ${client.state}`,
        `CEP: ${client.zipCode}`
      ].filter(Boolean).join('\n');

      const splitAddress = doc.splitTextToSize(fullAddress, 70);
      doc.text(splitAddress, 120, 62);

      // Items Table
      const tableColumn = ["Descrição do Serviço", "Valor"];
      const tableRows = [
        [
          job.description,
          new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(job.price)
        ]
      ];

      autoTable(doc, {
        startY: 80,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 },
        columnStyles: {
          0: { cellWidth: 120 },
          1: { cellWidth: 50, halign: 'right' },
        }
      });

      // Total
      const finalY = (doc as any).lastAutoTable?.finalY || 80;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Total Recebido:', 144, finalY + 15, { align: 'right' });
      doc.text(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(job.price), 184, finalY + 15, { align: 'right' });

      // Footer / Signature
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Declaramos ter recebido a importância acima especificada, referente aos serviços descritos.', 14, finalY + 35);

      doc.line(60, finalY + 60, 150, finalY + 60);
      doc.text('Assinatura do Prestador', 105, finalY + 65, { align: 'center' });

      const safeFileName = `Recibo_${client.name.replace(/[^a-zA-Z0-9]/g, '_')}_${format(new Date(), 'ddMMyyyy')}.pdf`;
      console.log('Saving Receipt PDF as:', safeFileName);

      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = safeFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating Receipt PDF:', error);
      alert('Erro ao gerar o recibo. Verifique o console para mais detalhes.');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const jobDate = parseISO(job.date);
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    if (filter === 'today') {
      return isAfter(jobDate, todayStart) && isBefore(jobDate, todayEnd);
    }
    if (filter === 'upcoming') {
      return isAfter(jobDate, todayEnd);
    }
    return true;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Agenda</h1>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Novo Serviço
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Todos
        </Button>
        <Button
          variant={filter === 'today' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('today')}
        >
          Hoje
        </Button>
        <Button
          variant={filter === 'upcoming' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('upcoming')}
        >
          Próximos
        </Button>
      </div>

      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900">Nenhum serviço agendado</p>
              <p className="text-sm text-gray-500 mt-1">Clique em "Novo Serviço" para adicionar.</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map(job => {
            const client = clients.find(c => c.id === job.clientId);
            const jobDate = parseISO(job.date);

            return (
              <Card key={job.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className={cn(
                    "p-4 sm:w-48 flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center border-b sm:border-b-0 sm:border-r transition-colors",
                    job.jobStatus === 'completed' ? "bg-green-50 border-green-100" :
                      job.jobStatus === 'in_progress' ? "bg-yellow-50 border-yellow-100" :
                        job.jobStatus === 'canceled' ? "bg-red-50 border-red-100" :
                          "bg-blue-50 border-blue-100"
                  )}>
                    <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1">
                      <div className="text-center sm:text-left">
                        <p className={cn(
                          "text-[10px] sm:text-sm font-semibold uppercase tracking-wider",
                          job.jobStatus === 'completed' ? "text-green-800" :
                            job.jobStatus === 'in_progress' ? "text-yellow-800" :
                              job.jobStatus === 'canceled' ? "text-red-800" :
                                "text-blue-800"
                        )}>
                          {format(jobDate, "MMM", { locale: ptBR })}
                        </p>
                        <p className={cn(
                          "text-2xl sm:text-3xl font-bold leading-none sm:my-1",
                          job.jobStatus === 'completed' ? "text-green-900" :
                            job.jobStatus === 'in_progress' ? "text-yellow-900" :
                              job.jobStatus === 'canceled' ? "text-red-900" :
                                "text-blue-900"
                        )}>
                          {format(jobDate, "dd")}
                        </p>
                      </div>
                      <p className={cn(
                        "hidden sm:block text-xs font-medium",
                        job.jobStatus === 'completed' ? "text-green-700" :
                          job.jobStatus === 'in_progress' ? "text-yellow-700" :
                            job.jobStatus === 'canceled' ? "text-red-700" :
                              "text-blue-700"
                      )}>
                        {format(jobDate, "EEEE", { locale: ptBR })}
                      </p>
                    </div>
                    <div className={cn(
                      "flex items-center font-bold text-xs sm:text-sm sm:mt-4 bg-white px-3 py-1.5 rounded-full shadow-sm",
                      job.jobStatus === 'completed' ? "text-green-800" :
                        job.jobStatus === 'in_progress' ? "text-yellow-800" :
                          job.jobStatus === 'canceled' ? "text-red-800" :
                            "text-blue-800"
                    )}>
                      <Clock className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {format(jobDate, "HH:mm")}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{job.description}</h3>
                        <div className="flex gap-2">
                          <Badge variant={
                            job.type === 'installation' ? 'info' :
                              job.type === 'maintenance' ? 'warning' : 'danger'
                          }>
                            {job.type === 'installation' ? 'Instalação' :
                              job.type === 'maintenance' ? 'Manutenção' : 'Reparo'}
                          </Badge>
                          <div className="relative inline-flex items-center">
                            <select
                              className={cn(
                                "appearance-none pl-2.5 pr-7 py-0.5 rounded-full text-xs font-semibold cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 border-0",
                                job.jobStatus === 'completed' ? "bg-green-100 text-green-800" :
                                  job.jobStatus === 'in_progress' ? "bg-yellow-100 text-yellow-800" :
                                    job.jobStatus === 'canceled' ? "bg-red-100 text-red-800" :
                                      "bg-blue-100 text-blue-800"
                              )}
                              value={job.jobStatus}
                              onChange={(e) => updateJob({ ...job, jobStatus: e.target.value as JobStatus })}
                            >
                              <option value="scheduled">Agendado</option>
                              <option value="in_progress">Em andamento</option>
                              <option value="completed">Concluído</option>
                              <option value="canceled">Cancelado</option>
                            </select>
                            <ChevronDown className={cn(
                              "absolute right-2 h-3 w-3 pointer-events-none",
                              job.jobStatus === 'completed' ? "text-green-800" :
                                job.jobStatus === 'in_progress' ? "text-yellow-800" :
                                  job.jobStatus === 'canceled' ? "text-red-800" :
                                    "text-blue-800"
                            )} />
                          </div>
                        </div>
                      </div>

                      {client && (
                        <div className="space-y-2 mt-4">
                          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 gap-1 sm:gap-2">
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4 text-gray-400" />
                              <span className="font-semibold">{client.name}</span>
                            </div>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <span className="ml-6 sm:ml-0">{client.phone}</span>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <MapPin className="mr-2 h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                            <span>
                              {client.street}, {client.number}{client.complement && ` - ${client.complement}`}
                              <br />
                              {client.neighborhood}, {client.city} - {client.state} • CEP: {client.zipCode}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Valor do Serviço:</span>
                        <span className="text-xl font-black text-gray-900">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(job.price)}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        {job.jobStatus === 'completed' && job.paymentStatus === 'paid' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateReceiptPDF(job)}
                            className="w-full sm:w-auto text-blue-600 border-blue-200 hover:bg-blue-50 h-11 sm:h-9"
                          >
                            <FileText className="mr-2 h-4 w-4" /> Gerar Recibo
                          </Button>
                        )}
                        <Button
                          variant={job.paymentStatus === 'paid' ? 'outline' : 'primary'}
                          size="sm"
                          onClick={() => togglePaymentStatus(job)}
                          className={cn(
                            "w-full sm:w-auto h-11 sm:h-9",
                            job.paymentStatus === 'paid' ? 'text-green-600 border-green-200 hover:bg-green-50' : ''
                          )}
                        >
                          {job.paymentStatus === 'paid' ? (
                            <><CheckCircle className="mr-2 h-4 w-4" /> Pago</>
                          ) : (
                            <><AlertCircle className="mr-2 h-4 w-4" /> Marcar como Pago</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Serviço">
        <form onSubmit={handleAddJob} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <select
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newJob.clientId}
              onChange={e => setNewJob({ ...newJob, clientId: e.target.value })}
              required
            >
              <option value="" disabled>Selecione um cliente</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {clients.length === 0 && (
              <p className="mt-1 text-xs text-amber-600">
                Você precisa cadastrar um cliente primeiro na aba "Clientes".
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Serviço</label>
            <select
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newJob.type}
              onChange={e => setNewJob({ ...newJob, type: e.target.value as JobType })}
              required
            >
              <option value="installation">Instalação</option>
              <option value="maintenance">Manutenção Preventiva</option>
              <option value="repair">Reparo / Conserto</option>
            </select>
          </div>

          <Input
            label="Descrição do Serviço"
            placeholder="Ex: Instalação Split 12000 BTUs"
            helperText="Resumo do que será feito no local."
            value={newJob.description}
            onChange={e => setNewJob({ ...newJob, description: e.target.value })}
            required
          />

          <Input
            label="Data e Hora"
            type="datetime-local"
            helperText="Quando o serviço será realizado."
            value={newJob.date}
            onChange={e => setNewJob({ ...newJob, date: e.target.value })}
            required
          />

          <Input
            label="Valor (R$)"
            type="number"
            min="0"
            step="0.01"
            helperText="Valor total cobrado pelo serviço."
            value={newJob.price}
            onChange={e => setNewJob({ ...newJob, price: Number(e.target.value) })}
            required
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Agendar Serviço</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
