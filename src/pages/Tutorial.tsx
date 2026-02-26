import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
    UserPlus,
    Calendar,
    FileText,
    CheckCircle,
    Settings,
    ArrowRight,
    ClipboardCheck,
    Smartphone,
    LayoutDashboard
} from 'lucide-react';

interface TutorialProps {
    onNavigate: (tab: string) => void;
}

export function Tutorial({ onNavigate }: TutorialProps) {
    const steps = [
        {
            title: '1. Configure seu Perfil',
            description: 'Comece definindo o nome da sua empresa e carregando sua logo. Isso deixará seus orçamentos e recibos com um visual profissional.',
            icon: Settings,
            color: 'bg-brand-100 text-brand-600',
            action: 'Configurações',
            target: 'settings'
        },
        {
            title: '2. Cadastre seus Clientes',
            description: 'Adicione os dados dos seus clientes, incluindo endereço completo. O NEXUS organizará tudo para você.',
            icon: UserPlus,
            color: 'bg-green-100 text-green-600',
            action: 'Ir para Clientes',
            target: 'clients'
        },
        {
            title: '3. Organize sua Agenda',
            description: 'Agende serviços e acompanhe o status (Agendado, Em andamento, Concluído). As cores ajudam você a bater o olho e saber o que precisa ser feito.',
            icon: Calendar,
            color: 'bg-amber-100 text-amber-600',
            action: 'Acessar Agenda',
            target: 'schedule'
        },
        {
            title: '4. Gere Orçamentos Profissionais',
            description: 'Crie orçamentos detalhados em PDF e envie diretamente para o WhatsApp do seu cliente em segundos.',
            icon: FileText,
            color: 'bg-purple-100 text-purple-600',
            action: 'Criar Orçamento',
            target: 'quotes'
        },
        {
            title: '5. Emita Recibos e Receba',
            description: 'Após concluir o serviço e receber o pagamento, o botão de "Gerar Recibo" aparecerá automaticamente para você finalizar o atendimento.',
            icon: ClipboardCheck,
            color: 'bg-emerald-100 text-emerald-600',
            action: 'Ver na Agenda',
            target: 'schedule'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                    Como usar o <span className="text-brand-600">NEXUS</span>
                </h1>
                <p className="text-lg text-gray-600">
                    Siga este guia simples para elevar o nível do seu negócio de climatização e impressionar seus clientes.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                {steps.map((step, index) => (
                    <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => onNavigate(step.target)}>
                        <div className="flex flex-col md:flex-row">
                            <div className={`p-8 flex items-center justify-center ${step.color} md:w-48 shrink-0`}>
                                <step.icon size={48} className="group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <CardContent className="p-8 flex-1">
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                            {step.description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onNavigate(step.target);
                                        }}
                                        className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300 hover:text-blue-700"
                                    >
                                        {step.action} <ArrowRight size={20} className="ml-2" />
                                    </button>
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="bg-gradient-to-r from-brand-600 to-brand-800 text-white border-0 shadow-premium group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/20 transition-colors" />
                <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
                    <div className="flex -space-x-4">
                        <Smartphone className="h-16 w-16 text-brand-100 drop-shadow-lg" />
                        <LayoutDashboard className="h-16 w-16 text-brand-100 drop-shadow-lg" />
                        <CheckCircle className="h-16 w-16 text-brand-100 drop-shadow-lg" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-3xl font-black mb-2 italic tracking-tighter uppercase">Nexus Web App</h3>
                        <p className="text-brand-100 text-lg max-w-xl font-medium">
                            Acesse de qualquer lugar, em qualquer dispositivo. Sua oficina na palma da mão.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
