import React from 'react';
import { useAppStore } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { format, parseISO, startOfMonth, isWithinInterval, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DollarSign, TrendingUp, Calendar, Trash2, ArrowUpDown } from 'lucide-react';

export function Earnings() {
    const { jobs, clients, updateJob, deleteJob } = useAppStore();
    const [sortBy, setSortBy] = React.useState<'date' | 'alphabetical' | 'value'>('date');

    const paidJobs = jobs
        .filter(job => job.paymentStatus === 'paid')
        .sort((a, b) => {
            if (sortBy === 'date') {
                return parseISO(b.date).getTime() - parseISO(a.date).getTime();
            }
            if (sortBy === 'alphabetical') {
                const nameA = clients.find(c => c.id === a.clientId)?.name || '';
                const nameB = clients.find(c => c.id === b.clientId)?.name || '';
                return nameA.localeCompare(nameB);
            }
            if (sortBy === 'value') {
                return b.price - a.price;
            }
            return 0;
        });

    const totalHistorical = paidJobs.reduce((acc, job) => acc + job.price, 0);

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const totalMonth = paidJobs
        .filter(job => isWithinInterval(parseISO(job.date), { start: monthStart, end: monthEnd }))
        .reduce((acc, job) => acc + job.price, 0);

    const handleRefund = (jobId: string) => {
        const job = jobs.find(j => j.id === jobId);
        if (job) {
            updateJob({ ...job, paymentStatus: 'pending' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Histórico de Recebidos</h1>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">{format(now, "MMMM yyyy", { locale: ptBR })}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-emerald-50 border-emerald-100 shadow-premium shadow-emerald-500/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-emerald-600 uppercase tracking-widest italic">Total Histórico</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-zinc-950 tracking-tighter italic">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalHistorical)}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-emerald-600 font-bold text-[10px] uppercase tracking-tighter">
                            <DollarSign size={12} />
                            Total acumulado no NEXUS
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-brand-50 border-brand-100 shadow-premium shadow-brand-500/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-brand-600 uppercase tracking-widest italic">Total do Mês</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-zinc-950 tracking-tighter italic">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalMonth)}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-brand-600 font-bold text-[10px] uppercase tracking-tighter">
                            <TrendingUp size={12} />
                            Ganhos registrados em {format(now, 'MMMM', { locale: ptBR })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <CardTitle>Todos os Recebimentos</CardTitle>
                    <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-100 w-full sm:w-auto">
                        <ArrowUpDown className="h-4 w-4 text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-transparent text-xs font-bold text-gray-700 uppercase tracking-wider outline-none cursor-pointer appearance-none pr-6 relative w-full sm:w-32"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right center',
                                backgroundSize: '1rem'
                            }}
                        >
                            <option value="date">Por Data</option>
                            <option value="alphabetical">Cliente (A-Z)</option>
                            <option value="value">Valor</option>
                        </select>
                    </div>
                </CardHeader>
                <CardContent>
                    {paidJobs.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <DollarSign className="mx-auto h-12 w-12 text-gray-200 mb-4" />
                            <p className="text-lg font-medium">Nenhum pagamento registrado ainda.</p>
                            <p className="text-sm">Os serviços marcados como "Pagos" aparecerão aqui.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-4 text-xs font-black text-zinc-400 uppercase tracking-widest italic">Data</th>
                                        <th className="py-4 text-xs font-black text-zinc-400 uppercase tracking-widest italic">Serviço</th>
                                        <th className="py-4 text-xs font-black text-zinc-400 uppercase tracking-widest italic text-right">Valor</th>
                                        <th className="py-4 text-xs font-black text-zinc-400 uppercase tracking-widest italic text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paidJobs.map(job => (
                                        <tr key={job.id} className="group hover:bg-zinc-50 transition-colors">
                                            <td className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-zinc-900 italic">
                                                        {format(parseISO(job.date), "dd/MM/yyyy")}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">
                                                        {format(parseISO(job.date), "HH:mm")}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-zinc-900 group-hover:text-brand-600 transition-colors">{job.description}</span>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={10} className="text-zinc-400" />
                                                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                                                                {job.type === 'installation' ? 'Instalação' : job.type === 'maintenance' ? 'Manutenção' : 'Reparo'}
                                                            </span>
                                                        </div>
                                                        <span className="hidden sm:inline text-zinc-300">•</span>
                                                        <span className="text-[10px] text-zinc-500 font-black italic">
                                                            {clients.find(c => c.id === job.clientId)?.name || 'Cliente Removido'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className="text-sm font-black text-emerald-600 italic">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(job.price)}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <button
                                                    onClick={() => handleRefund(job.id)}
                                                    className="p-2 text-zinc-400 hover:text-rose-600 transition-colors group/btn"
                                                    title="Extornar (Mudar para Pendente)"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
