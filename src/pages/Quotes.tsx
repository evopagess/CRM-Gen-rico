import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Plus, FileText, Download, Trash2, User, Calendar } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Quote, QuoteItem } from '../types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../utils/cn';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function Quotes() {
  const { quotes, clients, addQuote, updateQuote, deleteQuote, settings } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newQuote, setNewQuote] = useState({
    clientId: '',
    date: format(new Date(), "yyyy-MM-dd"),
    items: [{ id: uuidv4(), description: '', quantity: 1, unitPrice: 0 }] as QuoteItem[],
  });

  const handleAddItem = () => {
    setNewQuote({
      ...newQuote,
      items: [...newQuote.items, { id: uuidv4(), description: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const handleRemoveItem = (id: string) => {
    setNewQuote({
      ...newQuote,
      items: newQuote.items.filter(item => item.id !== id)
    });
  };

  const handleItemChange = (id: string, field: keyof QuoteItem, value: any) => {
    setNewQuote({
      ...newQuote,
      items: newQuote.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const calculateTotal = (items: QuoteItem[]) => {
    return items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  };

  const handleAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote.clientId || newQuote.items.length === 0) return;

    const total = calculateTotal(newQuote.items);

    addQuote({
      id: uuidv4(),
      clientId: newQuote.clientId,
      date: new Date(newQuote.date).toISOString(),
      items: newQuote.items,
      total,
      status: 'active',
      createdAt: new Date().toISOString()
    });

    setNewQuote({
      clientId: '',
      date: format(new Date(), "yyyy-MM-dd"),
      items: [{ id: uuidv4(), description: '', quantity: 1, unitPrice: 0 }],
    });
    setIsModalOpen(false);
  };

  const generatePDF = (quote: Quote) => {
    try {
      const client = clients.find(c => c.id === quote.clientId);
      if (!client) {
        console.error('Client not found for quote:', quote.clientId);
        return;
      }

      console.log('Generating PDF for quote:', quote.id);
      const doc = new jsPDF();

      // Logo and Header
      if (settings.logo) {
        try {
          doc.addImage(settings.logo, 'PNG', 14, 12, 12, 12);
          doc.setFontSize(20);
          doc.setTextColor(217, 119, 6); // brand-600 golden
          doc.text(settings.companyName, 30, 22);
        } catch (e) {
          console.error('Error adding logo to PDF', e);
          doc.setFontSize(20);
          doc.setTextColor(217, 119, 6);
          doc.text(settings.companyName, 14, 22);
        }
      } else {
        doc.setFontSize(20);
        doc.setTextColor(217, 119, 6); // brand-600 golden
        doc.text(settings.companyName, 14, 22);
      }

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Prestação de Serviços', 14, 28);

      // Title
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text('ORÇAMENTO', 14, 45);

      // Quote Info
      doc.setFontSize(10);
      doc.text(`Nº do Orçamento: ${quote.id.substring(0, 8).toUpperCase()}`, 14, 55);
      doc.text(`Data: ${format(parseISO(quote.date), 'dd/MM/yyyy')}`, 14, 60);

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
      const tableColumn = ["Descrição", "Qtd", "Valor Unit.", "Total"];
      const tableRows = quote.items.map(item => [
        item.description,
        item.quantity.toString(),
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice),
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice)
      ]);

      autoTable(doc, {
        startY: 80,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [217, 119, 6] }, // brand-600 golden
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 },
        columnStyles: {
          0: { cellWidth: 70 },
          1: { cellWidth: 20, halign: 'center' },
          2: { cellWidth: 40, halign: 'right' },
          3: { cellWidth: 40, halign: 'right' },
        }
      });

      // Total
      const finalY = (doc as any).lastAutoTable?.finalY || 80;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Total:', 164, finalY + 15, { align: 'right' });
      doc.text(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.total), 204, finalY + 15, { align: 'right' });

      // Footer
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150);
      doc.text('Orçamento válido por 15 dias.', 14, finalY + 30);
      doc.text('Obrigado pela preferência!', 14, finalY + 35);

      const safeFileName = `Orcamento_${client.name.replace(/[^a-zA-Z0-9]/g, '_')}_${format(new Date(), 'ddMMyyyy')}.pdf`;
      console.log('Saving PDF as:', safeFileName);

      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = safeFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Status update removed as per new direct toggle requirement
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erro ao gerar o PDF. Verifique o console para mais detalhes.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orçamentos</h1>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Novo Orçamento
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.length === 0 ? (
          <div className="col-span-full text-center py-20 text-zinc-500 bg-white rounded-3xl border border-zinc-200 shadow-premium">
            <div className="bg-zinc-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-zinc-300" />
            </div>
            <p className="text-xl font-bold text-zinc-900 tracking-tight">Nenhum orçamento criado</p>
            <p className="text-sm mt-2 font-medium">Capture sua primeira oportunidade clicando em "Novo Orçamento".</p>
          </div>
        ) : (
          quotes.map(quote => {
            const client = clients.find(c => c.id === quote.clientId);

            return (
              <Card key={quote.id} className="flex flex-col justify-between group hover:-translate-y-1 transition-all">
                <CardHeader className="pb-4 relative">
                  <div className="flex justify-between items-start">
                    <Badge variant={quote.status === 'completed' ? 'success' : 'info'}>
                      {quote.status === 'completed' ? 'FECHADO' : 'ATIVO'}
                    </Badge>
                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                      #{quote.id.substring(0, 6)}
                    </span>
                  </div>
                  <CardTitle className="mt-6 text-3xl font-black italic text-zinc-900 tracking-tighter">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.total)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-zinc-600 font-bold">
                      <User className="mr-3 h-4 w-4 text-brand-500" />
                      <span className="truncate">{client?.name || 'Cliente Removido'}</span>
                    </div>
                    <div className="flex items-center text-sm text-zinc-500 font-medium">
                      <Calendar className="mr-3 h-4 w-4 text-zinc-400" />
                      <span>{format(parseISO(quote.date), "dd 'de' MMM, yyyy", { locale: ptBR })}</span>
                    </div>
                    <div className="flex items-center text-[10px] text-zinc-400 font-black uppercase tracking-widest bg-zinc-50 w-fit px-3 py-1 rounded-full">
                      <FileText className="mr-2 h-3 w-3" />
                      <span>{quote.items.length} {quote.items.length === 1 ? 'item' : 'itens'}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 pt-0 bg-transparent flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteQuote(quote.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuote({ ...quote, status: quote.status === 'active' ? 'completed' : 'active' })}
                      className={cn(
                        "h-9 px-3",
                        quote.status === 'active' ? 'text-green-600 border-green-200 hover:bg-green-50' : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                      )}
                    >
                      {quote.status === 'active' ? 'Concluir' : 'Reativar'}
                    </Button>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="h-9 px-3"
                    onClick={() => generatePDF(quote)}
                  >
                    <Download className="mr-1 sm:mr-2 h-4 w-4" /> <span className="sm:inline">PDF</span>
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Orçamento" className="max-w-2xl">
        <form onSubmit={handleAddQuote} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newQuote.clientId}
                onChange={e => setNewQuote({ ...newQuote, clientId: e.target.value })}
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
            <Input
              label="Data"
              type="date"
              helperText="Data de emissão do orçamento."
              value={newQuote.date}
              onChange={e => setNewQuote({ ...newQuote, date: e.target.value })}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Itens do Orçamento</label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <Plus className="mr-1 h-3 w-3" /> Adicionar Item
              </Button>
            </div>

            <div className="space-y-3">
              {newQuote.items.map((item, index) => (
                <div key={item.id} className="relative flex flex-col gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="w-full">
                    <Input
                      label="Descrição"
                      placeholder="Ex: Instalação de Ponto de Energia"
                      value={item.description}
                      onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-end">
                    <Input
                      label="Quantidade"
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                      required
                    />
                    <Input
                      label="Valor Unitário (R$)"
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={e => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8 rounded-full shadow-sm"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={newQuote.items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <div className="gradient-brand text-white px-8 py-5 rounded-[2rem] shadow-premium shadow-brand-500/20 flex items-center gap-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest opacity-80 relative z-10">Total Estimado</span>
                <span className="text-3xl font-black italic tracking-tighter relative z-10">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateTotal(newQuote.items))}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar Orçamento</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
