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

export function Tutorial() {
    const steps = [
        {
            title: '1. Configure seu Perfil',
            description: 'Comece definindo o nome da sua empresa e carregando sua logo. Isso deixará seus orçamentos e recibos com um visual profissional.',
            icon: Settings,
            color: 'bg-blue-100 text-blue-600',
            action: 'Vá em Configurações'
        },
        {
            title: '2. Cadastre seus Clientes',
            description: 'Adicione os dados dos seus clientes, incluindo endereço completo. O AeroDesk organizará tudo para você.',
            icon: UserPlus,
            color: 'bg-green-100 text-green-600',
            action: 'Vá em Clientes'
        },
        {
            title: '3. Organize sua Agenda',
            description: 'Agende serviços e acompanhe o status (Agendado, Em andamento, Concluído). As cores ajudam você a bater o olho e saber o que precisa ser feito.',
            icon: Calendar,
            color: 'bg-amber-100 text-amber-600',
            action: 'Vá em Agenda'
        },
        {
            title: '4. Gere Orçamentos Profissionais',
            description: 'Crie orçamentos detalhados em PDF e envie diretamente para o WhatsApp do seu cliente em segundos.',
            icon: FileText,
            color: 'bg-purple-100 text-purple-600',
            action: 'Vá em Orçamentos'
        },
        {
            title: '5. Emita Recibos e Receba',
            description: 'Após concluir o serviço e receber o pagamento, o botão de "Gerar Recibo" aparecerá automaticamente para você finalizar o atendimento.',
            icon: ClipboardCheck,
            color: 'bg-emerald-100 text-emerald-600',
            action: 'No card do serviço na Agenda'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                    Como usar o <span className="text-blue-600">AeroDesk</span>
                </h1>
                <p className="text-lg text-gray-600">
                    Siga este guia simples para elevar o nível do seu negócio de climatização e impressionar seus clientes.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                {steps.map((step, index) => (
                    <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
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
                                    <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                        {step.action} <ArrowRight size={20} className="ml-2" />
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 shadow-2xl">
                <CardContent className="p-10 text-center space-y-6">
                    <div className="flex justify-center gap-6 mb-2">
                        <Smartphone className="h-12 w-12 text-blue-100" />
                        <LayoutDashboard className="h-12 w-12 text-blue-100" />
                        <CheckCircle className="h-12 w-12 text-blue-100" />
                    </div>
                    <h2 className="text-3xl font-bold leading-tight">Pronto para começar?</h2>
                    <p className="text-blue-100 text-lg max-w-xl mx-auto">
                        O AeroDesk foi feito para facilitar sua vida. Organize seus horários, clientes e finanças em um só lugar.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
