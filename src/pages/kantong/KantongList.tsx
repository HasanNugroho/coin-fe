import { useEffect, useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { useFinanceStore } from '../../store/finance.store';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { Button } from '../../components/ui/button';
import { KantongCard } from '../../components/common/KantongCard';
import { KantongDialog } from '../../components/common/KantongDialog';
import { KantongDetail } from '../../components/common/KantongDetail';
import type { Kantong } from '../../types';

export function KantongList() {
    const { kantongs, fetchKantongs, createKantong, updateKantong, isLoading, error } = useFinanceStore();
    const { language } = useLanguageStore();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedKantongForDetail, setSelectedKantongForDetail] = useState<Kantong | undefined>();
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        fetchKantongs();
    }, [fetchKantongs]);

    const handleCreateOrUpdate = async (data: Omit<Kantong, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
        try {
            setLocalError(null);
            await createKantong(data);
            setIsCreateDialogOpen(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setLocalError(errorMessage);
        }
    };

    const handleEditKantong = async (updatedKantong: Kantong) => {
        try {
            setLocalError(null);
            const { id, user_id: _, created_at: __, updated_at: ___, deleted_at: ____, ...data } = updatedKantong;
            await updateKantong(id, data);
            setSelectedKantongForDetail(updatedKantong);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setLocalError(errorMessage);
        }
    };

    const handleCardClick = (kantong: Kantong) => {
        setSelectedKantongForDetail(kantong);
    };

    const handleNewKantong = () => {
        setIsCreateDialogOpen(true);
    };

    // Sort kantongs: main pocket first, then others in API order
    const sortedKantongs = [...kantongs].sort((a, b) => {
        if (a.type === 'main') return -1;
        if (b.type === 'main') return 1;
        return 0;
    });

    const displayError = localError || error;

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
                    <p className="mt-2 text-gray-600">{t(language, 'kantong.subtitle')}</p>
                </div>
                <Button onClick={handleNewKantong}>
                    <Plus className="h-4 w-4" />
                    {t(language, 'kantong.addKantong')}
                </Button>
            </div>

            {displayError && (
                <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div className="flex-1">
                        <p className="text-sm text-red-800">{displayError}</p>
                    </div>
                    <button
                        onClick={() => setLocalError(null)}
                        className="text-red-600 hover:text-red-800"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedKantongs.map((kantong) => (
                    <KantongCard key={kantong.id} kantong={kantong} onClick={() => handleCardClick(kantong)} />
                ))}
            </div>

            {kantongs.length === 0 && (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">{t(language, 'kantong.noKantongs')}</p>
                    <Button className="mt-4" onClick={handleNewKantong}>
                        <Plus className="h-4 w-4" />
                        {t(language, 'kantong.createFirst')}
                    </Button>
                </div>
            )}

            <KantongDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                kantong={undefined}
                onSubmit={handleCreateOrUpdate}
            />

            {selectedKantongForDetail && (
                <KantongDetail
                    kantong={selectedKantongForDetail}
                    onClose={() => setSelectedKantongForDetail(undefined)}
                    onEdit={handleEditKantong}
                    allKantongs={kantongs}
                />
            )}
        </div>
    );
}
