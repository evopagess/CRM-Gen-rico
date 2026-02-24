import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Save, Building2 } from 'lucide-react';

export function Settings() {
    const { settings, updateSettings } = useAppStore();
    const [companyName, setCompanyName] = useState(settings.companyName);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings({ ...settings, companyName });
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
                                placeholder="Ex: SmartAir Ar Condicionado"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                helperText="Este nome substituirá o 'SmartAir' no cabeçalho dos PDFs."
                                required
                            />

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
