/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BrasilAPIAddress {
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    service: string;
}

export async function fetchAddressByCep(cep: string): Promise<BrasilAPIAddress | null> {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
        return null;
    }

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`);
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching CEP:', error);
        return null;
    }
}
