import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Plus, Search, Phone, MapPin, User, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '../types';

export function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const handleOpenAddModal = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      phone: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      street: client.street || '',
      number: client.number || '',
      complement: client.complement || '',
      neighborhood: client.neighborhood || '',
      city: client.city || '',
      state: client.state || '',
      zipCode: client.zipCode || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const clientData = {
      name: formData.name,
      phone: formData.phone,
      street: formData.street,
      number: formData.number,
      complement: formData.complement,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
    };

    if (editingClient) {
      updateClient({
        ...editingClient,
        ...clientData
      });
    } else {
      addClient({
        id: uuidv4(),
        ...clientData,
        createdAt: new Date().toISOString()
      });
    }

    setFormData({
      name: '',
      phone: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    });
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleConfirmDelete = (id: string) => {
    setClientToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete);
      setIsDeleteModalOpen(false);
      setClientToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Clientes</h1>
        <Button onClick={handleOpenAddModal} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar cliente por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <User className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900">Nenhum cliente encontrado</p>
              <p className="text-sm mt-1">Adicione um novo cliente para começar.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredClients.map(client => (
                <div key={client.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors group relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{client.name}</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="mr-2 h-3.5 w-3.5" />
                          {client.phone}
                        </div>
                        <div className="flex items-start text-sm text-gray-500">
                          <MapPin className="mr-2 h-3.5 w-3.5 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">
                            {client.street}, {client.number}
                            {client.complement && ` - ${client.complement}`}
                            <br />
                            {client.neighborhood}, {client.city} - {client.state}
                            <br />
                            CEP: {client.zipCode}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-2">
                      <button
                        onClick={() => handleOpenEditModal(client)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleConfirmDelete(client.id)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? "Editar Cliente" : "Novo Cliente"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome Completo"
            placeholder="Ex: João Silva"
            helperText="Como o nome aparecerá nos orçamentos."
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Telefone / WhatsApp"
            placeholder="Ex: (11) 99999-9999"
            helperText="Apenas números ou com formatação."
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Rua / Logradouro"
              placeholder="Ex: Rua das Flores"
              value={formData.street}
              onChange={e => setFormData({ ...formData, street: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Número"
                placeholder="Ex: 123"
                value={formData.number}
                onChange={e => setFormData({ ...formData, number: e.target.value })}
                required
              />
              <Input
                label="CEP"
                placeholder="Ex: 01234-567"
                value={formData.zipCode}
                onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Bairro"
              placeholder="Ex: Centro"
              value={formData.neighborhood}
              onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
              required
            />
            <Input
              label="Complemento"
              placeholder="Ex: Apto 42"
              value={formData.complement}
              onChange={e => setFormData({ ...formData, complement: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Cidade"
              placeholder="Ex: São Paulo"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              required
            />
            <Input
              label="Estado (UF)"
              placeholder="Ex: SP"
              value={formData.state}
              onChange={e => setFormData({ ...formData, state: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editingClient ? "Salvar Alterações" : "Salvar Cliente"}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        className="max-w-sm"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <p className="text-gray-600">Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.</p>
          <div className="flex justify-center gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button type="button" variant="danger" onClick={handleDelete}>Excluir</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
