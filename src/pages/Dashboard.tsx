import React from 'react';
import { useAppStore } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { format, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, DollarSign, Clock, CheckCircle, ArrowRight, UserPlus, FileText, ChevronDown } from 'lucide-react';
import { JobStatus } from '../types';
import { cn } from '../utils/cn';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { jobs, quotes, clients, updateJob } = useAppStore();

  const todayJobs = jobs.filter(job => isToday(parseISO(job.date)));
  const pendingPayments = jobs.filter(job => job.paymentStatus === 'pending' && job.jobStatus === 'completed');

  const totalPending = pendingPayments.reduce((acc, job) => acc + job.price, 0);
  const totalEarnedToday = todayJobs
    .filter(job => job.paymentStatus === 'paid')
    .reduce((acc, job) => acc + job.price, 0);

  const isNewUser = clients.length === 0 && jobs.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Visão Geral</h1>
        <p className="text-sm text-gray-500 capitalize">{format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
      </div>

      {isNewUser && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-2">Bem-vindo ao AeroDesk! 👋</h2>
            <p className="text-blue-800 mb-6">
              Parece que você está começando agora. Siga os passos abaixo para organizar seu negócio:
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
                  <UserPlus size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">1. Adicione um Cliente</h3>
                <p className="text-sm text-gray-500 mb-3">Cadastre os dados do seu primeiro cliente para começar.</p>
                <span className="text-xs font-medium text-blue-600 mt-auto flex items-center">
                  Vá para Clientes <ArrowRight size={12} className="ml-1" />
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
                  <Calendar size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">2. Agende um Serviço</h3>
                <p className="text-sm text-gray-500 mb-3">Marque uma instalação ou manutenção na agenda.</p>
                <span className="text-xs font-medium text-blue-600 mt-auto flex items-center">
                  Vá para Agenda <ArrowRight size={12} className="ml-1" />
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
                  <FileText size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">3. Crie um Orçamento</h3>
                <p className="text-sm text-gray-500 mb-3">Gere um PDF profissional para enviar pelo WhatsApp.</p>
                <span className="text-xs font-medium text-blue-600 mt-auto flex items-center">
                  Vá para Orçamentos <ArrowRight size={12} className="ml-1" />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Serviços Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{todayJobs.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {todayJobs.filter(j => j.jobStatus === 'completed').length} concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">A Receber</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPending)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {pendingPayments.length} serviços pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Recebido Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalEarnedToday)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Orçamentos Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {quotes.filter(q => q.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Aguardando aprovação</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Agenda de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            {todayJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                <p>Nenhum serviço agendado para hoje.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayJobs.map(job => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg cursor-pointer transition-colors"
                    onClick={() => onNavigate('schedule')}
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-900">{job.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(parseISO(job.date), "HH:mm")} • {
                          job.type === 'installation' ? 'Instalação' :
                            job.type === 'maintenance' ? 'Manutenção' : 'Reparo'
                        }
                      </p>
                    </div>
                    <div className="relative inline-flex items-center" onClick={(e) => e.stopPropagation()}>
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pagamentos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingPayments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                <p>Tudo em dia! Nenhum pagamento pendente.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPayments.slice(0, 5).map(job => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg cursor-pointer transition-colors"
                    onClick={() => onNavigate('schedule')}
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-900">{job.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(parseISO(job.date), "dd/MM/yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm text-red-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(job.price)}
                      </p>
                      <Badge variant="danger" className="mt-1 text-[10px] px-1.5 py-0">Pendente</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
