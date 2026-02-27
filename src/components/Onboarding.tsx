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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
            username,
            password,
            onboardingCompleted: true
        });
    };

    return (
        <div className="fixed inset-0 bg-black z-[100] overflow-y-auto overflow-x-hidden">
            <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 py-8">
                {/* Animated Tech Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-600/30 rounded-full blur-[140px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-400/20 rounded-full blur-[120px]" />
                    <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-400/10 rounded-full blur-[100px]" />

                    {/* Subtle Grid Line Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    />
                </div>

                <div className="max-w-md w-full py-8 relative z-10 animate-in fade-in zoom-in duration-700">
                    <div className="flex flex-col items-center mb-12">
                        <div className="flex items-center justify-center mb-8">
                            <div className="max-w-[200px] sm:max-w-[240px] w-full flex items-center justify-center group pointer-events-none">
                                <img src="/loom_logo.png" alt="Logo" className="w-full h-auto object-contain" />
                            </div>
                        </div>
                        <p className="text-brand-100 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs opacity-80 italic text-center">Redefinindo sua gestão profissional</p>
                    </div>

                    <form onSubmit={handleComplete}>
                        <Card className="border-0 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-white/95 backdrop-blur-md">
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

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            label="Usuário"
                                            placeholder="Seu usuário"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                        <Input
                                            label="Senha"
                                            type="password"
                                            placeholder="Sua senha"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Foto de Perfil ou Logo</label>
                                        <div className="flex items-center gap-4">
                                            <div className="h-20 w-20 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
                                                {logo ? (
                                                    <img src={logo} alt="Preview" className="h-full w-full object-cover" />
                                                ) : (
                                                    <img src="/loom_logo.png" alt="Logo" className="h-full w-full object-contain p-2" />
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
        </div>
    );
}
