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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function Quotes() {
  const { quotes, clients, addQuote, updateQuote, deleteQuote } = useAppStore();
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
      status: 'draft',
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

      // Header
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235); // blue-600
      doc.text('SmartAir', 14, 22);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Serviços de Ar-Condicionado', 14, 28);

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
      if (client.address) {
        const splitAddress = doc.splitTextToSize(client.address, 70);
        doc.text(splitAddress, 120, 62);
      }

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
        headStyles: { fillColor: [37, 99, 235] },
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

      if (quote.status === 'draft') {
        updateQuote({ ...quote, status: 'sent' });
      }
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quotes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900">Nenhum orçamento criado</p>
            <p className="text-sm mt-1">Crie seu primeiro orçamento para enviar aos clientes.</p>
          </div>
        ) : (
          quotes.map(quote => {
            const client = clients.find(c => c.id === quote.clientId);

            return (
              <Card key={quote.id} className="flex flex-col justify-between">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <Badge variant={
                      quote.status === 'accepted' ? 'success' :
                        quote.status === 'rejected' ? 'danger' :
                          quote.status === 'sent' ? 'info' : 'default'
                    }>
                      {quote.status === 'accepted' ? 'Aprovado' :
                        quote.status === 'rejected' ? 'Recusado' :
                          quote.status === 'sent' ? 'Enviado' : 'Rascunho'}
                    </Badge>
                    <span className="text-xs text-gray-500 font-medium">
                      #{quote.id.substring(0, 6).toUpperCase()}
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-xl">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.total)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="font-medium truncate">{client?.name || 'Cliente Removido'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <span>{format(parseISO(quote.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="mr-2 h-4 w-4 text-gray-400" />
                      <span>{quote.items.length} {quote.items.length === 1 ? 'item' : 'itens'}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center rounded-b-xl">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteQuote(quote.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => generatePDF(quote)}
                  >
                    <Download className="mr-2 h-4 w-4" /> Gerar PDF
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
                <div key={item.id} className="flex flex-col sm:flex-row gap-2 items-start sm:items-end bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="w-full sm:flex-1">
                    <Input
                      label={index === 0 ? "Descrição" : undefined}
                      placeholder="Ex: Limpeza de Ar Condicionado"
                      value={item.description}
                      onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="w-20">
                      <Input
                        label={index === 0 ? "Qtd" : undefined}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="w-32">
                      <Input
                        label={index === 0 ? "Valor Unit." : undefined}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={e => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className={index === 0 ? "pt-6" : ""}>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={newQuote.items.length === 1}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <div className="bg-blue-50 text-blue-900 px-4 py-3 rounded-lg border border-blue-100 flex items-center gap-4">
                <span className="text-sm font-medium">Total Estimado:</span>
                <span className="text-xl font-bold">
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
