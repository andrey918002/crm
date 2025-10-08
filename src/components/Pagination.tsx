import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps<T> {
    items: T[];
    itemsPerPage?: number;
    renderItem: (item: T, index: number) => React.ReactNode;
}

export function Pagination<T>({
                                  items,
                                  itemsPerPage = 6,
                                  renderItem,
                              }: PaginationProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {currentItems.map((item, index) => renderItem(item, index))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center gap-2 mt-4 ">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        ←
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => changePage(page)}
                            className=''
                        >
                            {page}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        →
                    </Button>
                </div>
            )}
        </div>
    );
}
