import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllInventoryItems, deleteInventoryItem } from '../db';
import type { InventoryItem } from '../db';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Trash2, Edit2, Search, AlertTriangle } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Inventory: React.FC = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [filterExpiring, setFilterExpiring] = useState(false);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const loadItems = async () => {
        const allItems = await getAllInventoryItems();

        // Sort: items with expiry first (asc), then items without expiry (desc by addedAt)
        allItems.sort((a, b) => {
            if (a.expiryDate && b.expiryDate) {
                return a.expiryDate.localeCompare(b.expiryDate);
            }
            if (a.expiryDate) return -1;
            if (b.expiryDate) return 1;
            return b.addedAt.localeCompare(a.addedAt);
        });

        setItems(allItems);
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Consume this item?')) {
            await deleteInventoryItem(id);
            loadItems();
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;

        if (filterExpiring) {
            if (!item.expiryDate) return false;
            const daysLeft = differenceInDays(parseISO(item.expiryDate), new Date());
            return daysLeft <= 3;
        }

        return true;
    });

    const getDaysLeft = (dateStr?: string) => {
        if (!dateStr) return null;
        const days = differenceInDays(parseISO(dateStr), new Date());
        if (days < 0) return <span className="text-red-600 font-bold">Expired</span>;
        if (days <= 3) return <span className="text-orange-600 font-bold">{days} days left</span>;
        return <span className="text-gray-500">{days} days left</span>;
    };

    return (
        <div className="space-y-4">
            <div className="sticky top-0 bg-gray-50 pt-2 pb-2 z-10 space-y-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search items..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="expiring"
                        checked={filterExpiring}
                        onChange={e => setFilterExpiring(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="expiring" className="text-sm font-medium text-gray-700 flex items-center">
                        <AlertTriangle size={16} className="mr-1 text-orange-500" />
                        Expiring soon (≤ 3 days)
                    </label>
                </div>
            </div>

            <div className="space-y-3 pb-20">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No items found.
                    </div>
                ) : (
                    filteredItems.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                                <div className="text-sm text-gray-600">
                                    {item.qty} {item.unit}
                                </div>
                                {item.expiryDate && (
                                    <div className="text-xs mt-1">
                                        {getDaysLeft(item.expiryDate)} ({format(parseISO(item.expiryDate), 'MMM d')})
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => navigate(`/edit/${item.id}`)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                >
                                    <Edit2 size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="fixed bottom-20 right-4">
                <Button
                    onClick={() => navigate('/scan')}
                    className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center p-0"
                >
                    <span className="text-2xl">+</span>
                </Button>
            </div>
        </div>
    );
};

export default Inventory;
