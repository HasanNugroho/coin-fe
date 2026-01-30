import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useFinanceStore } from '../../store/finance.store';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { Button } from '../../components/ui/button';
import { KantongCard } from '../../components/common/KantongCard';
import { KantongDialog } from '../../components/common/KantongDialog';
import type { Kantong } from '../../types';

export function KantongList() {
    const { kantongs, fetchKantongs, createKantong, updateKantong, isLoading } = useFinanceStore();
    const { language } = useLanguageStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedKantong, setSelectedKantong] = useState<Kantong | undefined>();

    useEffect(() => {
        fetchKantongs();
    }, [fetchKantongs]);

    const handleCreateOrUpdate = async (data: Omit<Kantong, 'id'>) => {
        if (selectedKantong) {
            await updateKantong(selectedKantong.id, data);
        } else {
            await createKantong(data);
        }
        setSelectedKantong(undefined);
    };

    const handleCardClick = (kantong: Kantong) => {
        setSelectedKantong(kantong);
        setIsDialogOpen(true);
    };

    const handleNewKantong = () => {
        setSelectedKantong(undefined);
        setIsDialogOpen(true);
    };

    if (isLoading && kantongs.length === 0) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-gray-500">{t(language, 'common.loading')}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t(language, 'kantong.title')}</h1>
                    <p className="mt-2 text-gray-600">{language === 'id' ? 'Atur uang Anda ke dalam kantong' : 'Organize your money into pockets'}</p>
                </div>
                <Button onClick={handleNewKantong}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t(language, 'kantong.addKantong')}
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {kantongs.map((kantong) => (
                    <KantongCard key={kantong.id} kantong={kantong} onClick={() => handleCardClick(kantong)} />
                ))}
            </div>

            {kantongs.length === 0 && (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">{t(language, 'kantong.noKantongs')}</p>
                    <Button className="mt-4" onClick={handleNewKantong}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t(language, 'kantong.createFirst')}
                    </Button>
                </div>
            )}

            <KantongDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                kantong={selectedKantong}
                onSubmit={handleCreateOrUpdate}
            />
        </div>
    );
}
