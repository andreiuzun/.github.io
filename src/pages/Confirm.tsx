import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, saveProduct, addInventoryItem, getInventoryItem, updateInventoryItem } from '../db';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { ArrowLeft } from 'lucide-react';

const Confirm: React.FC = () => {
    const { ean, id } = useParams<{ ean?: string; id?: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        qty: 1,
        unit: 'buc',
        expiryDate: '',
    });

    useEffect(() => {
        const loadData = async () => {
            if (id) {
                // Edit mode
                const item = await getInventoryItem(id);
                if (item) {
                    setFormData({
                        name: item.name,
                        qty: item.qty,
                        unit: item.unit,
                        expiryDate: item.expiryDate || '',
                    });
                }
            } else if (ean && ean !== 'manual') {
                // Add mode with EAN
                const product = await getProduct(ean);
                if (product) {
                    setFormData(prev => ({
                        ...prev,
                        name: product.name,
                        qty: product.defaultQty,
                        unit: product.defaultUnit,
                    }));
                }
            }
            setLoading(false);
        };
        loadData();
    }, [ean, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) return;

        if (id) {
            // Update existing
            const existing = await getInventoryItem(id);
            if (existing) {
                await updateInventoryItem({
                    ...existing,
                    name: formData.name,
                    qty: Number(formData.qty),
                    unit: formData.unit,
                    expiryDate: formData.expiryDate || undefined,
                });
            }
        } else {
            // Add new
            await addInventoryItem({
                ean: ean === 'manual' ? 'manual-' + Date.now() : ean!,
                name: formData.name,
                qty: Number(formData.qty),
                unit: formData.unit,
                expiryDate: formData.expiryDate || undefined,
            });

            // Save product info for future if it's a real EAN
            if (ean && ean !== 'manual') {
                await saveProduct({
                    ean,
                    name: formData.name,
                    defaultQty: Number(formData.qty),
                    defaultUnit: formData.unit,
                });
            }
        }

        navigate('/');
    };

    if (loading) return <div className="p-4 text-center">Loading...</div>;

    return (
        <div className="p-4 max-w-lg mx-auto">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold">{id ? 'Edit Item' : 'Confirm Item'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Product Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Milk"
                />

                <div className="flex gap-4">
                    <Input
                        label="Quantity"
                        type="number"
                        min="0.1"
                        step="any"
                        value={formData.qty}
                        onChange={e => setFormData({ ...formData, qty: Number(e.target.value) })}
                        className="flex-1"
                    />
                    <Select
                        label="Unit"
                        value={formData.unit}
                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                        options={[
                            { value: 'buc', label: 'buc' },
                            { value: 'g', label: 'g' },
                            { value: 'kg', label: 'kg' },
                            { value: 'ml', label: 'ml' },
                            { value: 'l', label: 'l' },
                        ]}
                        className="w-24"
                    />
                </div>

                <Input
                    label="Expiry Date (Optional)"
                    type="date"
                    value={formData.expiryDate}
                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                />

                <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full">
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Confirm;
