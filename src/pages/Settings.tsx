import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Save, Building2, Upload } from 'lucide-react';

export function Settings() {
    const { settings, updateSettings } = useAppStore();
    const [companyName, setCompanyName] = useState(settings.companyName);
    const [logo, setLogo] = useState<string | undefined>(settings.logo);

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

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings({ ...settings, companyName, logo });
        alert('Configurações salvas com sucesso!');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Configurações</h1>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleSave}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                <CardTitle>Perfil da Empresa</CardTitle>
                            </div>
                            <CardDescription>
                                Personalize os dados que aparecem nos seus orçamentos e recibos.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                label="Nome da Empresa / Profissional"
                                placeholder="Ex: AeroDesk Serviços"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                helperText="Este nome substituirá o 'AeroDesk' no cabeçalho dos PDFs."
                                required
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Foto de Perfil ou Logo</label>
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                                    <div className="h-24 w-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                                        {logo ? (
                                            <img src={logo} alt="Logo" className="h-full w-full object-cover" />
                                        ) : (
                                            <Building2 className="h-10 w-10 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                            <span className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                                <Upload className="mr-2 h-4 w-4" /> Alterar Imagem
                                            </span>
                                            <input type="file" className="sr-only" accept="image/*" onChange={handleLogoChange} />
                                        </label>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            Recomendado: 400x400px. <br />
                                            Sua logo aparecerá nos orçamentos e recibos gerados.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button type="submit">
                                    <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}
