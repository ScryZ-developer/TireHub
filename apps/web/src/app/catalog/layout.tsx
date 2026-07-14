import { Suspense } from 'react';

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div className="p-4 text-text-secondary">Загрузка...</div>}>{children}</Suspense>;
}
