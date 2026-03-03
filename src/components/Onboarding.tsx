import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Building2, Upload, Rocket } from 'lucide-react';

export function Onboarding() {
    const { settings, updateSettings } = useAppStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleComplete = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings({
            ...settings,
            companyName: 'Minha Empresa',
            email,
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
                        <div className="flex items-center justify-center mb-10">
                            <div className="w-32 sm:w-40 h-auto flex items-center justify-center pointer-events-none">
                                <img
                                    src="/login_logo.png"
                                    alt="Logo"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>
                        <p className="text-brand-100 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs opacity-80 italic text-center">Redefinindo sua gestão profissional</p>
                    </div>

                    <form onSubmit={handleComplete}>
                        <Card className="border-0 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-white/95 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle>Conectar ao Sistema</CardTitle>
                                <CardDescription>
                                    Acesse sua conta com seu e-mail e senha.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <Input
                                        label="E-mail"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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

                                <Button type="submit" className="w-full py-6 text-lg">
                                    Entrar Agora
                                </Button>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </div>
    );
}
