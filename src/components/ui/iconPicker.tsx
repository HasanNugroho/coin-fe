import { useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Input } from "./input";

type IconPickerProps = {
    value?: string;
    onChange: (icon: string) => void;
    language?: "id" | "en";
};

export function IconPicker({
    value = "",
    onChange,
    language = "en",
}: IconPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    // ✅ FIX: lucide icons are FUNCTIONS
    const iconNames = useMemo(
        () =>
            Object.keys(LucideIcons).filter(
                (key) =>
                    key !== "createLucideIcon" &&
                    key !== "default" &&
                    typeof (LucideIcons as any)[key] === "object"
            ),
        []
    );

    const filteredIcons = useMemo(
        () =>
            iconNames.filter((name) =>
                name.toLowerCase().includes(search.toLowerCase())
            ),
        [iconNames, search]
    );

    const SelectedIcon =
        value && (LucideIcons as any)[value]
            ? (LucideIcons as any)[value]
            : null;

    return (
        <div className="relative">
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className="flex w-full items-center gap-2 p-2 border rounded-md hover:bg-gray-50"
            >
                {SelectedIcon ? (
                    <>
                        <SelectedIcon className="h-5 w-5" />
                        <span className="text-sm">{value}</span>
                    </>
                ) : (
                    <span className="text-sm text-gray-500">
                        {language === "id" ? "Pilih ikon" : "Select icon"}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute z-50 mt-2 w-full bg-white border rounded-lg shadow-lg">
                        {/* Search */}
                        <div className="p-2 border-b sticky top-0 bg-white">
                            <div className="relative">
                                <LucideIcons.Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={
                                        language === "id" ? "Cari ikon..." : "Search icons..."
                                    }
                                    className="pl-8"
                                />
                            </div>
                        </div>

                        {/* Icon Grid */}
                        <div className="grid grid-cols-6 gap-1 p-2 max-h-80 overflow-y-auto">
                            {filteredIcons.slice(0, 100).map((iconName) => {
                                const Icon = (LucideIcons as any)[iconName];
                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        title={iconName}
                                        onClick={() => {
                                            onChange(iconName);
                                            setIsOpen(false);
                                            setSearch("");
                                        }}
                                        className={`p-3 rounded-md flex items-center justify-center hover:bg-gray-100 ${value === iconName ? "bg-blue-100" : ""
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </button>
                                );
                            })}
                        </div>

                        {filteredIcons.length > 100 && (
                            <div className="p-2 text-xs text-center text-gray-500 border-t">
                                {language === "id"
                                    ? `Menampilkan 100 dari ${filteredIcons.length} ikon`
                                    : `Showing 100 of ${filteredIcons.length} icons`}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
