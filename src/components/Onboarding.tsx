import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Building2, Upload, Rocket } from 'lucide-react';

export function Onboarding() {
    const { settings, updateSettings } = useAppStore();
    const [companyName, setCompanyName] = useState('');
    const [logo, setLogo] = useState<string | undefined>(undefined);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleComplete = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings({
            ...settings,
            companyName: companyName || 'Minha Empresa',
            logo,
            onboardingCompleted: true
        });
    };

    return (
        <div className="fixed inset-0 bg-blue-600 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-md w-full py-8">
                <div className="text-center mb-8 text-white">
                    <div className="inline-flex p-3 rounded-2xl bg-white/20 mb-4 backdrop-blur-sm">
                        <Rocket className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Bem-vindo ao AeroDesk!</h1>
                    <p className="text-blue-100 italic">"Ponto de início para elevar seu negócio de climatização"</p>
                </div>

                <form onSubmit={handleComplete}>
                    <Card className="border-0 shadow-2xl">
                        <CardHeader>
                            <CardTitle>Configurar Perfil</CardTitle>
                            <CardDescription>
                                Vamos começar configurando os dados básicos da sua empresa.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <Input
                                    label="Nome da sua Empresa"
                                    placeholder="Ex: João Ar Condicionado"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    required
                                />

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Foto de Perfil ou Logo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-20 w-20 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
                                            {logo ? (
                                                <img src={logo} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <Building2 className="h-8 w-8 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                    <Upload className="mr-2 h-4 w-4" /> Escolher Imagem
                                                </span>
                                                <input type="file" className="sr-only" accept="image/*" onChange={handleLogoChange} />
                                            </label>
                                            <p className="mt-1 text-xs text-gray-500">PNG, JPG até 2MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full py-6 text-lg">
                                Começar a usar agora
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}
