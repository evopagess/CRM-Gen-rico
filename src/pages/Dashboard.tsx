import React from 'react';
import { useAppStore } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { format, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, DollarSign, Clock, CheckCircle, ArrowRight, UserPlus, FileText, ChevronDown, Trash2 } from 'lucide-react';
import { JobStatus } from '../types';
import { cn } from '../utils/cn';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { jobs, quotes, clients, updateJob, deleteJob } = useAppStore();
  const [isEarningsModalOpen, setIsEarningsModalOpen] = React.useState(false);

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
        <Card className="bg-brand-50 border-brand-100 shadow-premium shadow-brand-500/10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl group-hover:bg-brand-500/10 transition-colors" />
          <CardContent className="p-8 relative z-10">
            <h2 className="text-2xl font-black text-zinc-900 mb-2 tracking-tighter uppercase italic">Bem-vindo! 👋</h2>
            <p className="text-brand-700 font-medium mb-8">
              Pronto para elevar o nível do seu negócio? Comece integrando seu fluxo de trabalho:
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <div
                onClick={() => onNavigate('clients')}
                className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm flex flex-col items-center text-center group/item hover:shadow-premium transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="gradient-brand p-4 rounded-2xl mb-4 text-white shadow-premium shadow-brand-500/30 group-hover/item:scale-110 transition-transform">
                  <UserPlus size={28} />
                </div>
                <h3 className="font-bold text-zinc-900 mb-2 text-lg">1. Clientes</h3>
                <p className="text-sm text-zinc-500 mb-6 font-medium">Cadastre e organize sua base de contatos agora.</p>
                <div className="mt-auto flex items-center text-xs font-black text-brand-600 uppercase tracking-widest group-hover/item:gap-2 transition-all">
                  Explorar Clientes <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
              <div
                onClick={() => onNavigate('schedule')}
                className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm flex flex-col items-center text-center group/item hover:shadow-premium transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="bg-amber-500 p-4 rounded-2xl mb-4 text-white shadow-premium shadow-amber-500/30 group-hover/item:scale-110 transition-transform">
                  <Calendar size={28} />
                </div>
                <h3 className="font-bold text-zinc-900 mb-2 text-lg">2. Agenda</h3>
                <p className="text-sm text-zinc-500 mb-6 font-medium">Agende instalações e manutenções com precisão.</p>
                <div className="mt-auto flex items-center text-xs font-black text-brand-600 uppercase tracking-widest group-hover/item:gap-2 transition-all">
                  Ver Agenda <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
              <div
                onClick={() => onNavigate('quotes')}
                className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm flex flex-col items-center text-center group/item hover:shadow-premium transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="bg-emerald-500 p-4 rounded-2xl mb-4 text-white shadow-premium shadow-emerald-500/30 group-hover/item:scale-110 transition-transform">
                  <FileText size={28} />
                </div>
                <h3 className="font-bold text-zinc-900 mb-2 text-lg">3. Orçamentos</h3>
                <p className="text-sm text-zinc-500 mb-6 font-medium">Gere PDFs profissionais e feche mais negócios.</p>
                <div className="mt-auto flex items-center text-xs font-black text-brand-600 uppercase tracking-widest group-hover/item:gap-2 transition-all">
                  Criar Orçamento <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black text-zinc-400 uppercase tracking-widest italic">Serviços Hoje</CardTitle>
            <div className="bg-brand-100 p-1.5 rounded-lg text-brand-600">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-4xl font-black text-zinc-950 tracking-tighter italic">
              {todayJobs.length}
            </div>
            <p className="text-[10px] sm:text-xs text-zinc-400 mt-2 truncate font-bold uppercase tracking-tighter opacity-70">
              {todayJobs.filter(j => j.jobStatus === 'completed').length} concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black text-zinc-400 uppercase tracking-widest italic">A Receber</CardTitle>
            <div className="bg-amber-100 p-1.5 rounded-lg text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-4xl font-black text-zinc-950 tracking-tighter italic truncate">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPending)}
            </div>
            <p className="text-[10px] sm:text-xs text-zinc-400 mt-2 truncate font-bold uppercase tracking-tighter opacity-70">
              {pendingPayments.length} pendentes
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-premium transition-all active:scale-[0.98]"
          onClick={() => setIsEarningsModalOpen(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black text-zinc-400 uppercase tracking-widest italic">Recebido Hoje</CardTitle>
            <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-4xl font-black text-zinc-950 tracking-tighter italic truncate">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalEarnedToday)}
            </div>
            <p className="text-[10px] sm:text-xs text-brand-600 mt-2 truncate font-bold uppercase tracking-tighter opacity-70 group-hover:underline">Gerenciar valores</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black text-zinc-400 uppercase tracking-widest italic">Orçamentos</CardTitle>
            <div className="bg-purple-100 p-1.5 rounded-lg text-purple-600">
              <CheckCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-4xl font-black text-zinc-950 tracking-tighter italic">
              {quotes.filter(q => q.status === 'active').length}
            </div>
            <p className="text-[10px] sm:text-xs text-zinc-400 mt-2 truncate font-bold uppercase tracking-tighter opacity-70">Ativos agora</p>
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
                          "appearance-none pl-3 pr-8 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-brand-500 border-0 transition-all active:scale-95",
                          job.jobStatus === 'completed' ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" :
                            job.jobStatus === 'in_progress' ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200" :
                              job.jobStatus === 'canceled' ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200" :
                                "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                        )}
                        value={job.jobStatus}
                        onChange={(e) => updateJob({ ...job, jobStatus: e.target.value as JobStatus })}
                      >
                        <option value="scheduled">Agendado</option>
                        <option value="in_progress">Andamento</option>
                        <option value="completed">Concluído</option>
                        <option value="canceled">Cancelado</option>
                      </select>
                      <ChevronDown className={cn(
                        "absolute right-2.5 h-3.5 w-3.5 pointer-events-none",
                        job.jobStatus === 'completed' ? "text-emerald-700" :
                          job.jobStatus === 'in_progress' ? "text-amber-700" :
                            job.jobStatus === 'canceled' ? "text-rose-700" :
                              "text-brand-700"
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

      <Modal
        isOpen={isEarningsModalOpen}
        onClose={() => setIsEarningsModalOpen(false)}
        title="Ganhos de Hoje"
      >
        <div className="space-y-4">
          {todayJobs.filter(j => j.paymentStatus === 'paid').length === 0 ? (
            <p className="text-center text-zinc-500 py-4">Nenhum recebimento registrado para hoje.</p>
          ) : (
            todayJobs.filter(j => j.paymentStatus === 'paid').map(job => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-bold text-zinc-900 truncate">{job.description}</p>
                  <p className="text-xs text-brand-600 font-black uppercase tracking-widest mt-1">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(job.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                    onClick={() => {
                      if (confirm('Deseja estornar este valor? O status voltará para pendente.')) {
                        updateJob({ ...job, paymentStatus: 'pending' });
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
          <Button
            className="w-full mt-4"
            variant="outline"
            onClick={() => {
              setIsEarningsModalOpen(false);
              onNavigate('earnings');
            }}
          >
            Ver Histórico Completo
          </Button>
        </div>
      </Modal>
    </div >
  );
}
